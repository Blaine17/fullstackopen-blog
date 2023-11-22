import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'test blog',
  author: 'test',
  url: 'test url',
  likes: 30,
  user: {
    name: 'test name',
    username: 'test username'
  }
}

const testuser ={
  name: 'test name',
  username: 'test username'
}

test('renders content', () => {

  render(<Blog blog={blog} />)
  const element = screen.getByText('test blog test')
  const url = screen.queryByText('test url')
  const likes = screen.queryByText(30)
  expect(element).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})

test('renders details when button clicked', async () => {

  render(<Blog blog={blog} user={testuser} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const url = screen.queryByText('test url')
  const likes = screen.queryByText(30)
  expect(url).toBeDefined()
  expect(likes).toBeDefined()

})

test('like button clicked twice', async () => {
  const mockHandler = jest.fn()

  render(<Blog blog={blog} user={testuser} handleLikeButton={mockHandler}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)

})