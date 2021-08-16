const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((acc, curr) => acc + curr.likes, 0);

  return blogs.length === 0 ? 0 : total;
};

const favoriteBlog = (blogs) => {
  if (blogs.length > 1) {
    const mostLikes = blogs.reduce((acc, curr) => {
      return acc.likes > curr.likes ? acc : curr;
    });

    const blog = {
      title: mostLikes.title,
      author: mostLikes.author,
      likes: mostLikes.likes,
    };

    return blog;
  } else if (blogs.length === 1) {
    const blog = {
      title: blogs[0].title,
      author: blogs[0].author,
      likes: blogs[0].likes,
    };

    return blog;
  } else {
    return null;
  }
};

const mostBlogs = (blogs) => {
  if (blogs.length > 1) {
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
  } else if (blogs.length === 1) {
    const author = {
      author: blogs[0].author,
      blogs: 1,
    };

    return author;
  } else {
    return null;
  }
};

const mostLikes = (blogs) => {
  if (blogs.length > 1) {
    //Counting likes for each author
    const list = blogs.reduce((acc, curr) => {
      let match = acc.find((element) => element.author === curr.author);

      if (match) {
        match.likes += curr.likes;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    //Finding out which author has the most likes
    const most = list.reduce((a, c) => (a.likes > c.likes ? a : c));

    const author = {
      author: most.author,
      likes: most.likes,
    };

    return author;
  } else if (blogs.length === 1) {
    const author = {
      author: blogs[0].author,
      likes: blogs[0].likes,
    };

    return author;
  } else {
    return null;
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
