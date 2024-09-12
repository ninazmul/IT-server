"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersWithMinimalInfoController = exports.getAllOrdersForAdmin = exports.updateOrderPaymentStatus = exports.createOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const order_service_1 = require("../services/order.service");
const notification_model_1 = __importDefault(require("../models/notification.model"));
const redis_1 = require("../utils/redis");
const order_model_1 = __importDefault(require("../models/order.model"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
// Create Order
exports.createOrder = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { courseId, name, email, phone, transactionId } = req.body;
    if (!courseId || !name || !email || !phone || !transactionId) {
        return next(new ErrorHandler_1.default("Missing required fields", 400));
    }
    try {
        const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        const course = yield course_model_1.default.findById(courseId);
        if (!user || !course) {
            return next(new ErrorHandler_1.default("User or Course not found!", 404));
        }
        const courseExistInUser = user.courses.some((course) => course.toString() === courseId);
        if (courseExistInUser) {
            return next(new ErrorHandler_1.default("You have already purchased this course!", 400));
        }
        // Check for existing order
        const existingOrder = yield order_model_1.default.findOne({
            "items.productId": courseId,
            userId: user.id.toString(),
        });
        if (existingOrder) {
            return next(new ErrorHandler_1.default("An order for this course already exists!", 400));
        }
        // Create a new order instance
        const order = new order_model_1.default({
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
        yield order.save();
        // Update user and course
        user.courses.push(course.id);
        yield redis_1.redis.set((_b = req.user) === null || _b === void 0 ? void 0 : _b._id, JSON.stringify(user));
        yield user.save();
        yield notification_model_1.default.create({
            user: user._id,
            title: "New Order",
            message: `You have a new order from ${course.name}`,
        });
        if (course.purchased) {
            course.purchased += 1;
        }
        else {
            course.purchased = 1;
        }
        yield course.save();
        // Implement your mail sending logic here
        res.status(200).json({ success: true });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.updateOrderPaymentStatus = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, isPaid } = req.body;
    if (!orderId || typeof isPaid !== "boolean") {
        return next(new ErrorHandler_1.default("Invalid order ID or payment status", 400));
    }
    try {
        // Find the order and populate the userId to access user details
        const order = yield order_model_1.default.findById(orderId).populate("userId");
        if (!order) {
            return next(new ErrorHandler_1.default("Order not found", 404));
        }
        // Update payment status
        order.isPaid = isPaid;
        yield order.save();
        // Send email if payment is confirmed
        if (isPaid) {
            const user = order.userId; // Ensure that userId is of type IUser
            const emailData = {
                user: { name: user.name }, // Access user's name
                orderId: order._id,
                totalAmount: order.totalAmount,
            };
            // Render the email template
            const templatePath = path_1.default.join(__dirname, "../mails/order-confirmation.ejs");
            const html = yield ejs_1.default.renderFile(templatePath, emailData);
            // Send the email
            try {
                yield (0, sendMail_1.default)({
                    email: user.email,
                    subject: "Order Payment Confirmed",
                    template: "order-confirmation.ejs",
                    data: emailData,
                });
                res.status(200).json({ success: true, order });
            }
            catch (emailError) {
                console.error("Error sending email:", emailError.message || emailError);
                return next(new ErrorHandler_1.default("Failed to send confirmation email", 500));
            }
        }
        else {
            res.status(200).json({ success: true, order });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// Get All Orders -- Only for Admin
exports.getAllOrdersForAdmin = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, order_service_1.getAllOrdersService)();
        return res.status(200).json(result);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// Get Orders with Minimal Info
exports.getOrdersWithMinimalInfoController = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, order_service_1.getOrdersWithMinimalInfo)();
        return res.status(200).json(result);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
