const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => sum + blog.likes, 0);

  return blogs.length === 0 ? 0 : total;
};

module.exports = {
  dummy,
  totalLikes,
};
