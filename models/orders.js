const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderDetailsSchema = new mongoose.Schema({
  productId: String,
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  rating: Number,
  stock: Number,
  brand: String,
  category: String,
  image_url: String,
  quantity: Number,
  totalPrice: Number,
  inCart: Boolean,
  colors: String,
  sizes: String,
});

const paymentDetails = new mongoose.Schema({
  cardNumber: String,
  expireDate: String,
  cvv: String,
  totalAmount: Number,
  noOfItems: Number,
});

const orderMetaSchema = new mongoose.Schema({
  orderId: String,
  expectedDeliveryDate: Date,
  isDelivered: Boolean,
});

const orderDetailsSchemaFull = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    orderDetails: [
      {
        orderInfo: [orderDetailsSchema],
        paymentDetails: paymentDetails,
        orderMeta: orderMetaSchema,
      },
    ],
  },
  { versionKey: false }
);

orderDetailsSchemaFull.pre("save", function (next) {
  this.orderDetails.forEach((order) => {
    if (!order.orderMeta) {
      order.orderMeta = {};
    }
    if (!order.orderMeta.expectedDeliveryDate) {
      order.orderMeta.expectedDeliveryDate = getRandomDeliveryDate();
    }
    if (!order.orderMeta.orderId) {
      order.orderMeta.orderId = uuidv4();
    }
  });
  next();
});

const orders = mongoose.model("orders", orderDetailsSchemaFull, "orders");

module.exports = orders;

function getRandomDeliveryDate() {
  const currentDate = new Date();
  const twoWeeksFromNow = new Date(currentDate);
  twoWeeksFromNow.setDate(currentDate.getDate() + 14);

  const randomDate = new Date(
    currentDate.getTime() +
      Math.random() * (twoWeeksFromNow.getTime() - currentDate.getTime())
  );
  return randomDate;
}
