const mongoose = require("mongoose");
const supertest = require("supertest");
const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");

const api = supertest(app);

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 17,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const initialUser = {
  name: "Test Testings",
  username: "test",
  password: "test1",
};

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  // for (let blog of initialBlogs) {
  //   let blogObject = new Blog(blog);
  //   await blogObject.save();
  // }
  await Blog.insertMany(initialBlogs);
}, 10000);

test("All blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("_id is transformed into id", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].id).toBeDefined();
});

test("A new blog in saved in database", async () => {
  await api.post("/api/users").send(initialUser).expect(200);

  const user = await api
    .post("/api/login")
    .send({
      username: initialUser.username,
      password: initialUser.password,
    })
    .expect(200);

  const newBlog = {
    title: "Google Search Engine",
    author: "Test Testings",
    url: "http://google.com",
    likes: 52,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${user.body.token}`)
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length + 1);

  const titles = response.body.map((r) => r.title);
  expect(titles).toContain("Google Search Engine");
});

test("Missing like property defaults to 0", async () => {
  const newBlog = {
    title: "Google Search Engine 2",
    author: "Edsger W. Dijkstra",
    url: "http://google2.com",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const likes = response.body.map((r) => r.likes);
  expect(likes).toContain(0);
});

test("Server responds with 400 if title or url are missing", async () => {
  const newBlog = {
    author: "Edsger W. Dijkstra",
    url: "http://google.com",
    likes: 52,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const newBlog2 = {
    title: "Google Search Engine 3",
    author: "Edsger W. Dijkstra",
    likes: 52,
  };

  await api.post("/api/blogs").send(newBlog2).expect(400);
});

test("Blog is deleted from the server", async () => {
  const response = await api.get("/api/blogs");
  const deletedTitle = response.body[0].title;

  const id = response.body[0].id;
  await api.delete(`/api/blogs/${id}`).expect(204);

  const secondResponse = await api.get("/api/blogs");
  const titles = secondResponse.body.map((r) => r.title);
  expect(titles).not.toContain(deletedTitle);
});

test("Blog is updated", async () => {
  const response = await api.get("/api/blogs");
  const id = response.body[0].id;

  const updatedBlog = {
    title: "The best React patterns",
    author: response.body[0].author,
    url: response.body[0].url,
    likes: response.body[0].likes,
  };

  await api
    .put(`/api/blogs/${id}`)
    .send(updatedBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const secondResponse = await api.get("/api/blogs");
  const titles = secondResponse.body.map((r) => r.title);
  expect(titles).toContain("The best React patterns");
});

test("Adding new blog without token returns 401", async () => {
  const newBlog = {
    title: "Google Search Engine",
    author: "Test Testings",
    url: "http://google.com",
    likes: 52,
  };

  await api.post("/api/blogs").send(newBlog).expect(401);

  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
});
