const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.userSchema = Joi.object({
  fullName: Joi.string().trim().required().escapeHTML(),
  email: Joi.string().email().trim().required().escapeHTML(),
  password: Joi.string()
    .required()
    .trim()
    .min(8)
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .message(
      "Password must be at least 8 characters long and contain both letters and numbers"
    )
    .escapeHTML(),
});

module.exports.bookSchema = Joi.object({
  title: Joi.string().trim().required().escapeHTML(),
  author: Joi.string().trim().required().escapeHTML(),
  genre: Joi.string().trim().required().escapeHTML(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().integer().min(0).required(),
  availability: Joi.boolean().default(true),
  id: Joi.string().optional(),
});

module.exports.orderSchema = Joi.object({
  address: Joi.string().trim().optional().escapeHTML(),
  phoneNumber: Joi.string().trim().optional().escapeHTML(),
  totalPrice: Joi.number().min(0).required(),
  dateOrdered: Joi.date().default(Date.now),
  orderStatus: Joi.string()
    .valid("Pending", "Confirmed", "Delivered", "Processed")
    .default("Pending"),
  paymentMethod: Joi.string().valid("Cash on Delivery", "Card"),
});
