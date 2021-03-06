const jwt = require("jsonwebtoken");
const logger = require("./logger");
const User = require("../models/user");

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    request.token = authorization.substring(7);
  }

  next();
};

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({
      error: "Token is missing",
    });
  }

  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET);
  } catch (error) {
    return response.status(401).json({
      error: "Token is invalid",
    });
  }

  try {
    request.user = await User.findById(decodedToken.id);
  } catch (error) {
    logger.error(error);
  }

  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: "Unknown endpoint",
  });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({
      error: "Malformatted ID",
    });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({
      error: error.message,
    });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "Invalid token",
    });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "Token expired",
    });
  }

  logger.error(error.message);

  next(error);
};

module.exports = {
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
