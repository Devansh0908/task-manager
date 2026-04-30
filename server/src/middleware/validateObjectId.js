const mongoose = require("mongoose");

const validateObjectId = (paramName) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    return res.status(400).json({ message: `Invalid ${paramName}` });
  }

  next();
};

module.exports = validateObjectId;
