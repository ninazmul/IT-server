import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  createOrder,
  getAllOrdersForAdmin,
  getOrdersWithMinimalInfoController,
  updateOrderPaymentStatus
} from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOrder);

orderRouter.get(
  "/get-all-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrdersForAdmin
);

orderRouter.get("/minimal-info", isAuthenticated, getOrdersWithMinimalInfoController);

orderRouter.put(
  "/update-payment-status",
  isAuthenticated,
  authorizeRoles("admin"),
  updateOrderPaymentStatus
);


export default orderRouter;
