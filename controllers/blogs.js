const blogsRoute = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");

blogsRoute.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRoute.post("/", (request, response) => {
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  });

  blog
    .save()
    .then((savedBlog) => {
      response.json(savedBlog);
    })
    .catch((error) => {
      logger.error(error);
    });
});

module.exports = blogsRoute;
