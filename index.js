const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const connectDB = require("./config/db.js");
const { errorHandler, routeNotFound } = require("./middleware/error");
const cors = require("cors");
const corsOptions = require("./config/corsConfig");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const ExpressError = require("./utils/expressError.js");
const { isAuthenticated } = require("./middleware/auth.js");
const { rabbitMQ } = require("./setup/rabbitmq.js");
const PORT = process.env.PORT || 3000;

connectDB();
rabbitMQ.connectQueue();
app.use(cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(xss());

app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      throw new ExpressError(
        `This request contains sanitized field: ${key}`,
        400
      );
    },
  })
);

app.use(helmet());


app.use("/api/v1/user", require("./routes/user"));
app.use("/api/v1/book" ,require("./routes/book"));
app.use("/api/v1/order",isAuthenticated, require("./routes/order"));

app.use(routeNotFound);
app.use(errorHandler);

module.exports = app;
