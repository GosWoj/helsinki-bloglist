const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((acc, blog) => acc + blog.likes, 0);

  return blogs.length === 0 ? 0 : total;
};

const favoriteBlog = (blogs) => {
  const mostLikes = blogs.reduce((acc, blog) => {
    return acc.likes > blog.likes ? acc : blog;
  });

  const blog = {
    title: mostLikes.title,
    author: mostLikes.author,
    likes: mostLikes.likes,
  };

  return blog;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
