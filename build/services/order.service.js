"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersWithMinimalInfo = exports.getAllOrdersService = exports.newOrder = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
// Create a new order
const newOrder = async (orderData) => {
    try {
        const order = await order_model_1.default.create(orderData);
        return {
            success: true,
            order,
        };
    }
    catch (error) {
        throw error;
    }
};
exports.newOrder = newOrder;
// Get all orders
const getAllOrdersService = async () => {
    try {
        const orders = await order_model_1.default.find().sort({ createdAt: -1 });
        return {
            success: true,
            orders,
        };
    }
    catch (error) {
        throw error;
    }
};
exports.getAllOrdersService = getAllOrdersService;
const getOrdersWithMinimalInfo = async () => {
    try {
        const orders = await order_model_1.default.find({}, "id isPaid items").sort({
            createdAt: -1,
        });
        return {
            success: true,
            orders,
        };
    }
    catch (error) {
        throw error;
    }
};
exports.getOrdersWithMinimalInfo = getOrdersWithMinimalInfo;
