const blogsRoute = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");

blogsRoute.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRoute.post("/", async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({
      error: "Missing title or url",
    });
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
  });

  try {
    const savedBlog = await blog.save();
    response.json(savedBlog);
  } catch (exception) {
    logger.error(exception);
  }
});

blogsRoute.delete("/:id", async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    logger.error(error);
  }
});

blogsRoute.put("/:id", async (request, response) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    });
    response.json(updatedBlog);
  } catch (error) {
    logger.error(error);
  }
});

module.exports = blogsRoute;
