const mongoose = require("mongoose");
const { paymentStatus, orderStatus } = require("../config/status");
const { paginate } = require("./plugins");

const orderScehma = mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, require: true },
        price: { type: Number, default: 0, required: true },
        qty: { type: Number, default: 0, required: true },
        subTotal: { type: Number, default: 0, required: true },
      },
    ],
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    address: {
      street: { type: String, required: true },
      addressLine2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pin: { type: String, minLength: 6, maxLength: 6 },
    },
    paymentStatus: {
      type: String,
      enum: [
        paymentStatus.PENDING,
        paymentStatus.PAID,
        paymentStatus.REFUNDED,
        paymentStatus.FAILED,
      ],
      default: "Pending",
    },
    status: {
      type: String,
      enum: [
        orderStatus.CANCELLED,
        orderStatus.CONFIRMED,
        orderStatus.DELIVERED,
        orderStatus.DISPATCHED,
        orderStatus.PENDING,
      ],
      default: "Pending",
    },
    sellerId: {type:mongoose.Types.ObjectId , ref:"User"},
    transactionNo: { type: String }, 
    createdBy: { type: mongoose.Types.ObjectId, ref: "Customer" },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

orderScehma.plugin(paginate);
/**
 * @typedef Order
 */
const Order = mongoose.model("Order", orderScehma);

module.exports = Order;
