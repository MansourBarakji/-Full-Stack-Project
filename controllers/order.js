const ExpressError = require("../utils/express_error");
const orderService = require("../service/orderService");

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
  if (!order) {
    throw new ExpressError("Order not Completed", 404);
  }
  res.status(200).json(order);
};

module.exports.getUserOrders = async (req, res) => {
  const userId = req.user._id;
  const orders = await orderService.getUserOrders(userId);
  res.status(200).json(orders);
};

module.exports.cancelOrder =async(req,res)=>{
  const {id} =req.body;
  const userId = req.user._id
  const orderInfo = {id ,userId}
const order = await orderService.cancelOrder(orderInfo)
if (!order) {
  throw new ExpressError("Order not Cancelled", 404);
}
res.status(200).json({message :'Order Cancelled Successfully'});
};

module.exports.restoreOrder =async(req,res)=>{
  const {id} =req.body;
  const userId = req.user._id
  const orderInfo = {id ,userId}
const order = await orderService.restoreOrder(orderInfo)
if (!order) {
  throw new ExpressError("Order not Restored", 404);
}
res.status(200).json({message :'Order Restored Successfully'});
};
module.exports.deleteOrder = async (req, res) => {
  const orderId = req.body.id;
  const userId = req.user._id;
  const orderInfo = {
    orderId,
    userId,
  };
  await orderService.deleteOrder(orderInfo);
  res.status(200).json({ message: "Order deleted succesful" });
};
