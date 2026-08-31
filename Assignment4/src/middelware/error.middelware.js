export const globalErrorHandling = (error, req, res, next) => {
  return res.status(error.cause?.status ?? 500).json({
    error_message: error.message || "server error",
    error: error,
    stack: error.stack,
  });
};
