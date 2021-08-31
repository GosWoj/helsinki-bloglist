const blogsRoute = require("express").Router();
const Blog = require("../models/blog");
const { userExtractor } = require("../utils/middleware");

blogsRoute.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      name: 1,
      username: 1,
    });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRoute.post("/", userExtractor, async (request, response, next) => {
  const user = request.user;

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRoute.delete("/:id", userExtractor, async (request, response, next) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() === user._id.toString()) {
    try {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  } else {
    response.status(401).json({
      error: "Unauthorized access",
    });
  }
});

blogsRoute.put("/:id", userExtractor, async (request, response, next) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  const newBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  };

  if (blog.user.toString() === user._id.toString()) {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        newBlog,
        {
          new: true,
        }
      );
      response.json(updatedBlog);
    } catch (error) {
      next(error);
    }
  } else {
    response.status(401).json({
      error: "Unauthorized access",
    });
  }
});

module.exports = blogsRoute;
