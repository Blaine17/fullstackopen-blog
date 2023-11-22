const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { 'username': 1, 'name': 1 })
  response.json(blogs)
})

// blog by id
blogsRouter.get('/:id', async (request, response, next) => {
  console.log('before if')
  const blog = await Blog.findById(request.params.id).populate('user', { 'username': 1, 'name': 1 })
  if (blog){
    return response.json(blog)
  } else {
    return response.status(404).end()
  }
})

// save blog to DB
blogsRouter.post('/', middleware.getTokenFrom, middleware.userExtractor, async (request, response, next) => {

  console.log('token is here', request.token)
  let body = request.body
  console.log(request.token)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(decodedToken.id)
  if (!decodedToken) {
    console.log('token is invalide')
    return response.status(401).json({ error: 'token invalid'})
  }

  const user = await User.findById(decodedToken.id)
  console.log(body.likes)
  
  if (!body.title || !body.url) {
    console.log('no title or url')
    return response.status(404).end()
  }
  else if (!body.likes) {
    body.likes = 0
  }
  const post = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })  
  const savedPost = await post.save()
  await savedPost.populate('user', { 'username': 1, 'name': 1 })
  user.blogs = user.blogs.concat(savedPost._id)
  await user.save()
  response.status(200).json(savedPost)
})

blogsRouter.delete('/:id', middleware.getTokenFrom, middleware.userExtractor, async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET) 
  console.log(decodedToken)
  if (!decodedToken) {
    return response.status(403).json({ error: 'invalid token'})
  }
  const blog = await Blog.findById(request.params.id).populate('user', { 'username': 1, 'name': 1 })
  console.log(blog)

  const userBlog = blog === null
    ? {user: false}
    : blog
  console.log(userBlog)
  if (!userBlog.user) {
    console.log('failed')
    return response.status(403).json({ error: 'note not found'})
  }
  else if (userBlog.user._id.toString() === decodedToken.id) {
    console.log('token matches id')
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    console.log('token does not match id')
    return response.status(403).json({ error: 'note not found'})
  }

 
})

blogsRouter.put('/:id', middleware.getTokenFrom, middleware.userExtractor, async (request, response, next) => {
  console.log('in put')
  console.log(request.user)
  console.log(request.token)
  console.log('body:---', request.body)
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes + 1
  }

  console.log('---')
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })
  await updatedBlog.populate('user', { 'username': 1, 'name': 1 })
  console.log(updatedBlog)
  response.json(updatedBlog)
})


module.exports = blogsRouter 