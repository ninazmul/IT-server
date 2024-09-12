import mongoose, { Document, Model, Schema } from "mongoose";

// Define Payment Info Interface
export interface IPaymentInfo {
  transaction_id?: string;
  phoneNumber?: number;
}

// Define the Item Interface
interface IOrderItem {
  productId: string;
  quantity: number;
  price: number;
}

// Define Order Interface that extends Mongoose Document
export interface IOrderData extends Document {
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  isPaid: boolean;
  paymentMethod: string;
  paymentInfo?: IPaymentInfo;
  createdAt: Date;
  updatedAt: Date;
}

// Define Order Schema
const OrderSchema: Schema<IOrderData> = new Schema(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paymentMethod: { type: String, required: true },
    paymentInfo: {
      transaction_id: { type: String, default: null },
      phoneNumber: { type: String, default: null },
    },
  },
  { timestamps: true }
);

// Create the Order Model
const OrderModel: Model<IOrderData> = mongoose.model<IOrderData>(
  "Order",
  OrderSchema
);

export default OrderModel;
