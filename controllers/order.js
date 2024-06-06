const ExpressError = require("../utils/express_error");
const orderService = require("../service/orderService");

// items =[ {bookId : 1 , quantity: 1} ]
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
  const orderId = req.params.id;
  const userId = req.user._id;
  const { address, phoneNumber, paymentMethod } = req.body;
  const orderInfo = {
    address,
    phoneNumber,
    paymentMethod,
    orderId,
    userId,
  };
  const order = await orderService.completeOrder(orderInfo);
  if (!order) {
    throw new ExpressError("Order not Created", 404);
  }
  res.status(200).json(order);
};

module.exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user._id;
  const orderInfo = {
    orderId,
    userId,
  };
  await orderService.deleteOrder(orderInfo);
  res.status(200).json({ message: "Order deleted succesful" });
};
