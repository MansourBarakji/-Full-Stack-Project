const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const connectDB = require("./config/db.js");
const { errorHandler, NotFound } = require("./middleware/error");
const PORT = process.env.PORT ||3000;

connectDB()

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));


app.use("/api/v1/user", require("./routes/user"));
app.use("/api/v1/book", require("./routes/book"));
app.use("/api/v1/order", require("./routes/order"));

app.use(NotFound);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
