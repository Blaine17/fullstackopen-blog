const { TokenExpiredError } = require('jsonwebtoken')
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body) 
  logger.info('---')
  next()
}

const getTokenFrom = (request, response, next) => {
  console.log('inside getTokenFrom')
  const authorization = request.get('authorization')
  console.log(authorization)
  if (authorization && authorization.startsWith('bearer ')) {
    request.token = authorization.replace('bearer ', '')
  }
  next()
}

const userExtractor = async (request, response, next) => {
  console.log('inside userExtractor')
  console.log(request.token)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(decodedToken)
  const user = await User.findById(decodedToken.id)
  if (user) {
    user.passwordHash = undefined
   
    request.user = user
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unkown endpoint'})
}

const errorHandler = (error, request, response, next) => {
  logger.error('---', error)

  if (error.name === 'CastError') {
    return response.status(404).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    // console.log(error)
    // let errors = {};
    //   Object.keys(error.errors).forEach((key) => {
    //     errors[key] = error.errors[key].message;
    //   });
    return response.status(400).json({error: error.errors.username.message })
  } else if (error.name === 'PasswordError') {
    return response.status(400).send(error.message)
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired'})
  }
  // console.log('error name:', error.name)
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  getTokenFrom,
  userExtractor
}