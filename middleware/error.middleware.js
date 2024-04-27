const errorMiddleware = (err, req, res, next) => {
  const statusCode = res.statusCode;
  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).json({
    message: errorMessage,
  });

  next();
};

export default errorMiddleware;
