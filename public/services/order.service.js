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
exports.getOrdersWithMinimalInfo = exports.getAllOrdersService = exports.newOrder = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
// Create a new order
const newOrder = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.default.create(orderData);
        return {
            success: true,
            order,
        };
    }
    catch (error) {
        throw error;
    }
});
exports.newOrder = newOrder;
// Get all orders
const getAllOrdersService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find().sort({ createdAt: -1 });
        return {
            success: true,
            orders,
        };
    }
    catch (error) {
        throw error;
    }
});
exports.getAllOrdersService = getAllOrdersService;
const getOrdersWithMinimalInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find({}, "id isPaid items").sort({
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
});
exports.getOrdersWithMinimalInfo = getOrdersWithMinimalInfo;
