const Cart = require("../models/cart");
const Book = require("../models/book");
const Order = require("../models/order");
const ExpressError = require("../utils/express_error");

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

      // Decrease the book quantity in the inventory
      //   book.quantity -= item.quantity;
      await book.save();

      // Add the cart item to the order
      order.cart.push(cart._id);

      // Calculate total price
      totalPrice += item.quantity * book.price;

      return cart._id;
    })
  );

  // Set the total price of the order
  order.totalPrice = totalPrice;

  // Save the order
  await order.save();

  return order;
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

  // Iterate through cart items and update book quantities
  for (const cartItem of order.cart) {
    const book = cartItem.book;
    // Decrease the book quantity
    book.quantity -= cartItem.quantity;
    await book.save();
  }

  // Save the updated order
  await order.save();
  return order;
};

const deleteOrder = async (orderInfo) => {
  const { userId, orderId } = orderInfo;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ExpressError("Book not found", 404);
  }
  // Check if the user is authorized to delete the order
  if (order.user.toString() !== userId.toString()) {
    throw new ExpressError("Unauthorized access to delete this shop", 403);
  }
  // Delete all cart items associated with the order
  await Cart.deleteMany({ _id: { $in: order.cart } });
  // Delete the main order
  await Order.findByIdAndDelete(orderId);
};
const orderService = {
  createCart,
  completeOrder,
  deleteOrder,
};

module.exports = orderService;
