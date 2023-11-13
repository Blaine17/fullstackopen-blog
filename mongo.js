const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(process.env.TEST_MONGODB_URI)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const random = Math.round(Math.random() * 10000)
const blog = new Blog({
  title: `Title${random}`,
  author: `Author${random}`, 
  url: `url${random}`,
  likes: random 
})

blog.save().then(result => {
  console.log('blog saved')
  mongoose.connection.close()
})
