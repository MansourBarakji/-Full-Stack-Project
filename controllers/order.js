const ExpressError = require("../utils/expressError");
const orderService = require("../service/orderService");
const { rabbitMQ } = require("../setup/rabbitmq");
const { RABBIT_MQ_QUEUES } = require("../constants/queue");
const Order = require("../models/order");
const Book = require("../models/book");

module.exports.createCart = async (req, res) => {
  const { items } = req.body;
  const userId = req.user._id;
  const cartInfo = {
    items,
    userId,
  };
  const order = await orderService.createCart(cartInfo);
  if (!order) {
    throw new ExpressError("Order not Created", 404);
  }
  res.status(200).json(order);
};

module.exports.completeOrder = async (req, res) => {
  const { address, phoneNumber, paymentMethod, orderId } = req.body;
  const userId = req.user._id;
  const orderInfo = {
    address,
    phoneNumber,
    paymentMethod,
    orderId,
    userId,
  };
  const order = await orderService.completeOrder(orderInfo);

  res.status(200).json(order);
};

module.exports.getUserOrders = async (req, res) => {
  const userId = req.user._id;
  const orders = await orderService.getUserOrders(userId);
  res.status(200).json(orders);
};

module.exports.getOrderToMange = async (req, res) => {
  const userId = req.user._id;
  const orders = await orderService.getOrderToMange(userId);
  if (!orders) {
    throw new ExpressError("Order not found", 404);
  }
  res.status(200).json(orders);
};

module.exports.cancelOrder = async (req, res) => {
  const { id } = req.body;
  const userId = req.user._id;
  const orderInfo = { id, userId };
  await rabbitMQ.sendMessage(RABBIT_MQ_QUEUES.ORDER, {
    type: "cancelOrder",
    ...orderInfo,
  });
  res.status(200).json({ message: "Order Cancelled Successfully" });
};

module.exports.restoreOrder = async (req, res) => {
  const { id } = req.body;
  const userId = req.user._id;
  const orderInfo = { id, userId };

  await rabbitMQ.sendMessage(RABBIT_MQ_QUEUES.ORDER, {
    type: "restoreOrder",
    ...orderInfo,
  });
  res.status(200).json({ message: "Order Restored Successfully" });
};
module.exports.deleteOrder = async (req, res) => {
  const orderId = req.body.id;
  const userId = req.user._id;
  const orderInfo = {
    orderId,
    userId,
  };
  await rabbitMQ.sendMessage(RABBIT_MQ_QUEUES.ORDER, {
    type: "deleteOrder",
    ...orderInfo,
  });
  res.status(200).json({ message: "Order deleted succesful" });
};

module.exports.confirmOrder = async (req, res) => {
  const userId = req.user._id;
  const { orderId, action } = req.body;
  const order = await Order.findById(orderId).populate({
    path: "cart",
    populate: {
      path: "book",
    },
  });

  if (!order) {
    throw new ExpressError("Order not found", 404);
  }

  const ownerBooks = order.cart.filter((cartItem) =>cartItem.book.user.equals(userId)
  );

  await Promise.all(
    ownerBooks.map(async (cart) => {
      const book = await Book.findById(cart.book._id);
      if (!book) {
        throw new ExpressError("Book not found", 404);
      }
      if(cart.quantity >book.quantity){
        throw new ExpressError(
          `Requested quantity (${cart.quantity}) exceeds available quantity (${book.quantity}) for book: ${book.title} , Please exceed the quantity `,
           404);
      
      }else{
      book.quantity -= cart.quantity;
      if (book.quantity <= 0) {
        book.availability = false;
        book.quantity = 0;
      }
      await book.save();
    }
    })
  );

  if (ownerBooks.length === 0) {
    throw new ExpressError("You do not have any books in this order", 404);
  }

  const ownerTotalPrice = ownerBooks.reduce((total, cartItem) => {
    return total + cartItem.price;
  }, 0);

  const newOrder = new Order({
    user: order.user,
    cart: ownerBooks.map((cartItem) => cartItem._id),
    address: order.address,
    phoneNumber: order.phoneNumber,
    totalPrice: ownerTotalPrice,
    orderStatus: action === "confirm" ? "Confirmed" : "Denied",
    paymentMethod: order.paymentMethod,
  });
  await newOrder.save();
  order.cart = order.cart.filter(
    (cartItem) => !cartItem.book.user.equals(userId)
  );
  if (order.cart.length == 0) {
    await order.deleteOne();
  } else {
    order.totalPrice -= ownerTotalPrice;
    await order.save();
  }

  res.status(200).json({
    message: `Order ${action === "confirm" ? "confirmed" : "denied"}`,
  });
};
