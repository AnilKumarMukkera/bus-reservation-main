class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg) { return new ApiError(400, msg); }
  static unauthorized(msg) { return new ApiError(401, msg); }
  static forbidden(msg) { return new ApiError(403, msg); }
  static notFound(msg) { return new ApiError(404, msg); }
}

module.exports = ApiError;
