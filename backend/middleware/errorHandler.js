const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field} already exists`,
    });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      message: "Validation Error",
      errors,
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
  });
};

const notFound = (req, res, next) => {
  if (req.originalUrl === '/favicon.ico') {
    return res.status(204).end();
  }
  
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
