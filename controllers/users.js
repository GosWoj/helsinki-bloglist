const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
  });

  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  if (!request.body.password || request.body.password.length <= 3) {
    response.status(400).json({
      error: "Password missing or too short",
    });
  } else {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(request.body.password, saltRounds);

    const user = new User({
      username: request.body.username,
      name: request.body.name,
      passwordHash,
    });

    try {
      const savedUser = await user.save();
      response.json(savedUser);
    } catch (error) {
      response.status(400).json({
        error: "Invalid username or password",
      });
    }
  }
});

module.exports = usersRouter;
