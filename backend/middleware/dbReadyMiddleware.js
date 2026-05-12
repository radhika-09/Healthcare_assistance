const mongoose = require("mongoose");

const requireDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    message:
      "Database is not connected. Check MongoDB Atlas Network Access and MONGO_URI.",
  });
};

module.exports = {
  requireDbConnection,
};
