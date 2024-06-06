module.exports.errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource Not Found";
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    statusCode = 400;
    // Extract the duplicated field name from the error message
    const fieldName = Object.keys(err.keyValue)[0];
    message = `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    } is already in use. Please choose another ${fieldName}.`;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? "" : err.stack,
  });
};

module.exports.NotFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
