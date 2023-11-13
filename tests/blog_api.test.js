const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/list_helper')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// const userForToken = {
//   username: user.username,
//   id: user._id
// }
var TOKEN;

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  const blogObjects = helper.initalBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)


  const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
    const forTokenUser = await User.findOne({ username: 'root' })
    console.log(forTokenUser)
    TOKEN = jwt.sign(
      {username: forTokenUser.username, id: forTokenUser._id.toString() }, 
      process.env.SECRET,
      {expiresIn: 60*60}
    )
    const users = await User.find({})
    const blogs = await Blog.find({})
  console.log(users)
  console.log(blogs)
  

})

describe('retrieved by id', () => {

  test('wrong id', async () => {
    const response = await api.get('/api/blogs/7')
    expect(response.status).toBe(404)
  })

  test('correct id', async () => {
    const blogs = await helper.initalBlogs
    const response = await api.get(`/api/blogs/${blogs[0].id}`)
    expect(response.id).toBe(blogs[0].id)
  })

})

describe('retrieve all blogs', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('there are 2 blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initalBlogs.length)
  })
  test('the first blog has likes', async () => {
    const response = await api.get('/api/blogs')
    const likes = response.body.map(blog => blog.likes)
    expect(likes).toContain(8345)
  })
  test('blog post contains id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe("saving to DB", () => {
  test('wont save if no title to DB', async () => {
    let blogClone = structuredClone(helper.newBlog)
    delete blogClone.title
    await api.post('/api/blogs').send(blogClone)
    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initalBlogs.length)
  })
  
  test('set 0 if likes null', async () => {
    let blogClone = structuredClone(helper.newBlog)
    delete blogClone.likes
    console.log(blogClone)
    const response = await api.post('/api/blogs').send(blogClone)
      .set('Authorization', `bearer ${TOKEN}`)
      
    expect(response.body.likes).toBe(0)
  })

  test('saved to DB', async () => {
    await api.post('/api/blogs').send(helper.newBlog)
      .set('Authorization', `bearer ${TOKEN}`)
    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    console.log(titles)
    expect(titles).toContain(helper.newBlog.title)
  })
})


describe('POST 404 if no', () => {
  test('title', async () => {
    let blogClone = structuredClone(helper.newBlog)
    delete blogClone.title
    const response = await api.post('/api/blogs').send(blogClone)
      .set('Authorization', `bearer ${TOKEN}`)
    expect(response.status).toBe(404)
  })
  
  test('url', async () => {
    let blogClone = structuredClone(helper.newBlog)
    delete blogClone.title
    const response = await api.post('/api/blogs').send(blogClone)
      .set('Authorization', `bearer ${TOKEN}`)
    expect(response.status).toBe(404)
  })
})

describe('deleted item', () => {

  test('cant delete someone elses blog', async () => {
    await api.post('/api/blogs').send(helper.newBlog).set('Authorization', `bearer ${TOKEN}`)
    const id =  await new mongoose.Types.ObjectId()
    let blog = await Blog.findOneAndUpdate({ title: "Title70" }, { user: id })
    // const blogs = await helper.blogsInDb()
    console.log(blog)
    const response = await api.delete(`/api/blogs/${blog.id}`)
    .set('Authorization', `bearer ${TOKEN}`)
    .expect(403)
    expect(response.body).toEqual({ error: 'note not found'})
   
  })
  test('204 response', async () => {

    await api.post('/api/blogs').send(helper.newBlog).set('Authorization', `bearer ${TOKEN}`)
    const x = await Blog.findOne({ title: "Title70" })
    // const blogs = await helper.blogsInDb()
    // console.log(x._id.toString())
    const response = await api.delete(`/api/blogs/${x._id.toString()}`)
      .set('Authorization', `bearer ${TOKEN}`)
    // console.log(response.status)
    expect(response.status).toBe(204)
  })
  test('blogs correct length', async () => {
    await api.post('/api/blogs').send(helper.newBlog).set('Authorization', `bearer ${TOKEN}`)
    const x = await Blog.findOne({ title: "Title70" })
    // const blogs = await Blog.find({})
    const blogs = await helper.blogsInDb()
    console.log(blogs)
    await api.delete(`/api/blogs/${x._id}`).set('Authorization', `bearer ${TOKEN}`)

    const afterDeleteBlogs = await helper.blogsInDb()
    expect(afterDeleteBlogs).toHaveLength(blogs.length - 1)
  })

  test('blog does not exist', async () => {
    const blogs = await helper.blogsInDb()
    await api.post('/api/blogs').send(helper.newBlog).set('Authorization', `bearer ${TOKEN}`)
    const x = await Blog.findOne({ title: "Title70" })
    console.log(x)
    await api.delete(`/api/blogs/${x._id}`).set('Authorization', `bearer ${TOKEN}`)
    const afterDeleteBlogs = await helper.blogsInDb()
    const deletedBlogTitle = afterDeleteBlogs.map(blog => blog.title)
    expect(deletedBlogTitle).not.toContain(x.title)
  })
})


test('handles update', async () => {
  const blogs = await helper.blogsInDb()
  const returedBlog = await api.put(`/api/blogs/${blogs[0].id}`).send(blogs[0]).set('Authorization', `bearer ${TOKEN}`)
  const updatedBlogs = await helper.blogsInDb()
  console.log(returedBlog)

  expect(blogs[0].likes + 1).toBe(updatedBlogs[0].likes)
}) 
test('put wrong id', async () => {
  const blogs = await helper.blogsInDb()
  const trueBlogs = await helper.blogsInDb()
  blogs[0].title = 'update'
  const response = await api.put(`/api/blogs/999`).send(blogs[0]).set('Authorization', `bearer ${TOKEN}`)
  const updatedBlogs = await helper.blogsInDb()
  expect(response.status).toBe(404)
  expect(trueBlogs).toEqual(updatedBlogs)
})
afterAll(async () => {
  await mongoose.connection.close()
})

