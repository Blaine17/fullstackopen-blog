import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

// const blog = {
//   title: 'test blog',
//   author: 'test',
//   url: 'test url',
//   likes: 30,
//   user: {
//     name: 'test name',
//     username: 'test username'
//   }
// }

// const testuser ={
//   name: 'test name',
//   username: 'test username'
// }

test('blog form submits', async () => {

  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} setErrorMessage={() => {}}/>)

  const titleInput = screen.getByPlaceholderText('title')
  const athorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('link to blog')
  const button = screen.getByText('post')


  user.type(titleInput, 'title')
  user.type(athorInput, 'author of blog')
  user.type(urlInput, 'this is the link to the blog')

  console.log(button)
  screen.debug()
  user.click(button)

  console.log(createBlog.mock)

  await waitFor(() => {
    // Assert that createBlog was called with the correct arguments
    expect(createBlog.mock.calls).toHaveLength(1)
  })

})