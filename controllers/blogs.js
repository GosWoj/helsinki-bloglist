const blogsRoute = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");

blogsRoute.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRoute.post("/", async (request, response) => {
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  });

  try {
    const savedBlog = await blog.save();
    response.json(savedBlog);
  } catch (exception) {
    logger.error(exception);
  }
});

module.exports = blogsRoute;
