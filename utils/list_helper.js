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

const mostBlogs = (blogs) => {
  //Creates array of occurrences of all values
  let list = blogs.map(
    (a) => blogs.filter((b) => a.author === b.author).length
  );

  //Math.max checks which value is the highest and returns
  //the name of the author from the index of original array
  const name = blogs[list.indexOf(Math.max(...list))].author;

  const author = {
    author: name,
    blogs: Math.max(...list),
  };

  return author;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
