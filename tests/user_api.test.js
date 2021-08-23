const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

describe("Validation of the user", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("password", 10);
    const user = new User({
      username: "test",
      passwordHash,
    });

    await user.save();
  });

  test("Invalid username is not accepted", async () => {
    const beforeUsers = await User.find({});
    const listBefore = beforeUsers.map((r) => r.toJSON());

    const newUser = {
      username: "ad",
      name: "Admin Anderson",
      password: "test",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const afterUsers = await User.find({});
    const listAfter = afterUsers.map((r) => r.toJSON());

    expect(listAfter).toHaveLength(listBefore.length);
  });

  test("Invalid password is not accepted", async () => {
    const beforeUsers = await User.find({});
    const listBefore = beforeUsers.map((r) => r.toJSON());

    const newUser = {
      username: "admin",
      name: "Admin Anderson",
      password: "te",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const afterUsers = await User.find({});
    const listAfter = afterUsers.map((r) => r.toJSON());

    expect(listAfter).toHaveLength(listBefore.length);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
