const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

loginRouter("/", async (request, response) => {
  const user = await User.findOne({
    username: request.body.username,
  });
  const correctPassword =
    user === null
      ? false
      : await bcrypt.compare(request.body.password, user.passwordHash);

  if (!(user && correctPassword)) {
    return response.status(401).json({
      error: "Invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  response.status(200).send({
    token,
    username: user.username,
    name: user.name,
  });
});

module.exports = loginRouter;
