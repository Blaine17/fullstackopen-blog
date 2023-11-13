const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./user_helper')

describe('when there is initially one user in db', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
    console.log('saved')
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    // const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result._body.error).toEqual("username is already taken")

  })
})

describe('user validation', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
    console.log('saved')
  })

  test('username length', async () => {
    const newUser = helper.validUser
    newUser.username = 'hg'
    const result = await api.post('/api/users').send(newUser)
      .expect(400)
    expect(result.body).toHaveProperty('error',`Username must be at Least 3, got ${newUser.username}`)
  })

  test('password length', async () => {
    const newUser = helper.validUser
    newUser.password = 'd'
    const result = await api.post('/api/users').send(newUser)
      .expect(400)

    expect(result.body).toHaveProperty('error', 'Password must be at least 3 characters long')
  })


})

afterAll(async () => {
  await mongoose.connection.close()
})