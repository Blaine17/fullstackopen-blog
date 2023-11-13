const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (password.length < 4) {
    const error = {
      name: 'PasswordError',
      message: { error: 'Password must be at least 3 characters long' }
    }
    return next(error)
    // return response.status().send({error: 'Passwords must be at least 3 characters long'})
  }
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user =  new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  console.log('made it past if statement')
  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { 'user': 0 })
  response.json(users)
})
module.exports = usersRouter
