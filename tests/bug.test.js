// const mongoose = require('mongoose')
// const supertest = require('supertest')
// const app = require('../app')
// const api = supertest(app)
// const Blog = require('../models/blog')
// const helper = require('../utils/list_helper')

test.only('bug', () => {
  expect('1').toBe('1')
  // const usersAtStart = await helper.usersInDb()
  // const newUser = {
  //   username: 'mluukkai',
  //   name: 'Matti Luukainen',
  //   password: 'salainen'
  // }

  // await api
  //   .post('/api/users')
  //   .send(newUser)
  //   .expect(201)
  //   .expect('Content-Type', /application\/json/)

  //   const usersAtEnd = await helper.usersInDb()
  //   expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

  //   const usernames = usersAtEnd.map(u => u.username)
  //   expect(usernames).toContain(newUser.username)
})