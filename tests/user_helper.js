const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const validUser = {
  username: 'this_is_a_test_username',
  name: 'this is a test name',
  password: 'thisisavalidepassword'
}

module.exports = {
  usersInDb,
  validUser
}