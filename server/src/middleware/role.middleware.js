const ApiError = require("../utils/ApiError");

/**
 * Role-Based Access Control middleware
 * Usage: authorizeRoles("admin") or authorizeRoles("admin", "moderator")
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied — role '${req.user.role}' is not authorized for this resource`
        )
      );
    }

    next();
  };
};

module.exports = { authorizeRoles };
