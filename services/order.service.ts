import OrderModel from "../models/order.model";
import { IOrderData } from "../models/order.model";

// Create a new order
export const newOrder = async (orderData: IOrderData) => {
  try {
    const order = await OrderModel.create(orderData);
    return {
      success: true,
      order,
    };
  } catch (error) {
    throw error;
  }
};

// Get all orders
export const getAllOrdersService = async () => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 });

    return {
      success: true,
      orders,
    };
  } catch (error) {
    throw error;
  }
};

export const getOrdersWithMinimalInfo = async () => {
  try {
    const orders = await OrderModel.find({}, "id isPaid items").sort({
      createdAt: -1,
    });
    return {
      success: true,
      orders,
    };
  } catch (error) {
    throw error;
  }
};

