const Blog = require('../models/blog')

const reverse = (string) => {
  return string 
    .split('')
    .reverse()
    .join('')
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length === 0 
  ? 0
  : array.reduce(reducer, 0) / array.length
}

const totalLikes = (array) => {
  const sumOfLikes = array.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)

  return sumOfLikes
}

const favoriteBlog = (array) => {
  favorite = array.reduce((most, current) => {
    console.log(current.likes)
    return (most.likes > current.likes) ? most : current
  })
  return favorite

}

const mostBlogs = (array) => {
  //create array of authors
  const authors = array.map(blog => blog.author)
  //create set of authors
  const authorsSet = [...new Set(authors)]
  //create array of blogCount
  const totalBlogs = new Array(authorsSet.length).fill(0)
  //iterate over blogs and add to blogCount based on index
  array.map(blog => {
    totalBlogs[authorsSet.indexOf(blog.author)] += 1
  })

  console.log(totalBlogs)
  //find index of author with most blogs
  const topAuthorIndex = totalBlogs.indexOf(Math.max(...totalBlogs))

  //create object that returns author from set and blogs from total blogs
  return {
    author: authorsSet[topAuthorIndex],
    blogs: totalBlogs[topAuthorIndex]
  }

}

const mostLikes = (array) => {
  
  const listAuthors = array.map(blog => blog.author)
  const setAuthors = [...new Set(listAuthors)]
  const totalLikes = new Array(setAuthors.length).fill(0)

  array.map(blog => {
    totalLikes[setAuthors.indexOf(blog.author)] += blog.likes
  })
  const indexOfMax = totalLikes.indexOf(Math.max(...totalLikes))

  return {
    author: setAuthors[indexOfMax],
    likes: totalLikes[indexOfMax]
  }
}

const initalBlogs = [
  {
    title: "Title6920",
    author: "Author6920",
    url: "url6920",
    likes: 6920
  },
  {
    title: "Title8345",
    author: "Author8345",
    url: "url8345",
    likes: 8345
  }
]

const newBlog = {
    title: "Title70",
    author: "Author70",
    url: "url70",
    likes: 70
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  reverse,
  average,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  initalBlogs,
  newBlog,
  blogsInDb
}