import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import userModel, { IUser } from "../models/user.model";
import CourseModel from "../models/course.model";
import {
  getAllOrdersService,
  getOrdersWithMinimalInfo,
  newOrder,
} from "../services/order.service";
import NotificationModel from "../models/notification.model";
import { redis } from "../utils/redis";
import OrderModel, { IOrderData } from "../models/order.model";
import sendMail from "../utils/sendMail";
import ejs from "ejs";
import path from "path";

// Create Order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, name, email, phone, transactionId } = req.body;

    if (!courseId || !name || !email || !phone || !transactionId) {
      return next(new ErrorHandler("Missing required fields", 400));
    }

    try {
      const user = await userModel.findById(req.user?._id);
      const course = await CourseModel.findById(courseId);

      if (!user || !course) {
        return next(new ErrorHandler("User or Course not found!", 404));
      }

      const courseExistInUser = user.courses.some(
        (course: any) => course.toString() === courseId
      );

      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already purchased this course!", 400)
        );
      }

      // Check for existing order
      const existingOrder = await OrderModel.findOne({
        "items.productId": courseId,
        userId: user.id.toString(),
      });

      if (existingOrder) {
        return next(
          new ErrorHandler("An order for this course already exists!", 400)
        );
      }

      // Create a new order instance
      const order = new OrderModel({
        userId: user.id.toString(),
        items: [
          {
            productId: course.id.toString(),
            quantity: 1,
            price: course.estimatedPrice || course.price,
          },
        ],
        totalAmount: course.estimatedPrice || course.price,
        isPaid: false,
        paymentMethod: "Manual",
        paymentInfo: {
          transaction_id: transactionId,
          phoneNumber: phone,
        },
      });

      // Save the new order
      await order.save();

      // Update user and course
      user.courses.push(course.id);
      await redis.set(req.user?._id as string, JSON.stringify(user));
      await user.save();

      await NotificationModel.create({
        user: user._id,
        title: "New Order",
        message: `You have a new order from ${course.name}`,
      });

      if (course.purchased) {
        course.purchased += 1;
      } else {
        course.purchased = 1;
      }
      await course.save();

      // Implement your mail sending logic here
      res.status(200).json({ success: true });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const updateOrderPaymentStatus = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, isPaid } = req.body;

    if (!orderId || typeof isPaid !== "boolean") {
      return next(new ErrorHandler("Invalid order ID or payment status", 400));
    }

    try {
      // Find the order and populate the userId to access user details
      const order = await OrderModel.findById(orderId).populate<{
        userId: IUser;
      }>("userId");

      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      // Update payment status
      order.isPaid = isPaid;
      await order.save();

      // Send email if payment is confirmed
      if (isPaid) {
        const user = order.userId as IUser; // Ensure that userId is of type IUser

        const emailData = {
          user: { name: user.name }, // Access user's name
          orderId: order._id,
          totalAmount: order.totalAmount,
        };

        // Render the email template
        const templatePath = path.join(
          __dirname,
          "../mails/order-confirmation.ejs"
        );
        const html = await ejs.renderFile(templatePath, emailData);

        // Send the email
        try {
          await sendMail({
            email: user.email,
            subject: "Order Payment Confirmed",
            template: "order-confirmation.ejs",
            data: emailData,
          });

          res.status(200).json({ success: true, order });
        } catch (emailError: any) {
          console.error(
            "Error sending email:",
            emailError.message || emailError
          );
          return next(
            new ErrorHandler("Failed to send confirmation email", 500)
          );
        }
      } else {
        res.status(200).json({ success: true, order });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get All Orders -- Only for Admin
export const getAllOrdersForAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllOrdersService();

      return res.status(200).json(result);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get Orders with Minimal Info
export const getOrdersWithMinimalInfoController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getOrdersWithMinimalInfo();
      return res.status(200).json(result);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
