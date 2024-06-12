const Cart = require("../models/cart");
const Book = require("../models/book");
const Order = require("../models/order");
const ExpressError = require("../utils/expressError");

const createCart = async (cartInfo) => {
  const { items, userId } = cartInfo;
  const order = new Order({
    user: userId,
    orderStatus: "Pending",
  });

  let totalPrice = 0;
  await Promise.all(
    items.map(async (item) => {
      const book = await Book.findById(item.bookId);
      if (!book) {
        throw new ExpressError("Book not found", 404);
      }
      if (item.quantity > book.quantity) {
        throw new ExpressError(
          `Requested quantity (${item.quantity}) exceeds available quantity (${book.quantity}) for book: ${book.title}`,
          404
        );
      }
      const cart = new Cart({
        book: book._id,
        quantity: item.quantity,
        price: book.price * item.quantity,
      });
      await cart.save();
      await book.save();
      order.cart.push(cart._id);
      totalPrice += cart.price;
      return cart._id;
    })
  );
  order.totalPrice = totalPrice;
  await order.save();
  return order;
};

const getUserOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate("user")
    .populate({
      path: "cart",
      populate: {
        path: "book",
      },
    });
  return orders;
};
const completeOrder = async (orderInfo) => {
  const { address, phoneNumber, paymentMethod, userId, orderId } = orderInfo;
  const order = await Order.findById(orderId)
    .populate("user")
    .populate({
      path: "cart",
      populate: {
        path: "book",
      },
    });
  if (!order) {
    throw new ExpressError("order not found", 404);
  }
  if (order.user._id.toString() !== userId.toString()) {
    throw new ExpressError("Unauthorized access to complete this order", 403);
  }
  order.address = address;
  order.phoneNumber = phoneNumber;
  order.paymentMethod = paymentMethod;
  order.orderStatus = "Processed";

  await order.save();
  return order;
};

const deleteOrder = async (orderInfo) => {
  const { userId, orderId } = orderInfo;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ExpressError("Order not found", 404);
  }
  if (order.user.toString() !== userId.toString()) {
    throw new ExpressError("Unauthorized access to delete this order", 403);
  }
  await Cart.deleteMany({ _id: { $in: order.cart } });
  await Order.findByIdAndDelete(orderId);
};

const cancelOrder = async (orderInfo) => {
  const { userId, id } = orderInfo;
  const order = await Order.findById(id);
  if (!order) {
    throw new ExpressError("Order not found", 404);
  }
  if (order.user.toString() !== userId.toString()) {
    throw new ExpressError("Unauthorized access to cancel this order", 403);
  }
  order.orderStatus = "Cancelled";
  await order.save();
  return order;
};

const restoreOrder = async (orderInfo) => {
  const { userId, id } = orderInfo;
  const order = await Order.findById(id);
  if (!order) {
    throw new ExpressError("Order not found", 404);
  }
  if (order.user.toString() !== userId.toString()) {
    throw new ExpressError("Unauthorized access to cancel this order", 403);
  }
  order.orderStatus = "Processed";
  await order.save();
  return order;
};

const getOrderToMange = async (userId) => {
  const orders = await Order.find({ orderStatus: "Processed" })
    .populate("user")
    .populate({
      path: "cart",
      populate: {
        path: "book",
        match: { user: userId },
      },
    });

  const filteredOrders = orders.filter((order) =>
    order.cart.some(
      (cartItem) => cartItem.book && cartItem.book.user.equals(userId)
    )
  );
  return filteredOrders;
};
const orderService = {
  createCart,
  completeOrder,
  deleteOrder,
  getUserOrders,
  cancelOrder,
  getOrderToMange,
  restoreOrder,
};

module.exports = orderService;
