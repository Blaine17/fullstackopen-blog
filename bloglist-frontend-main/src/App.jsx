import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/loginForm'
import LogoutButton from './components/logoutButton'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll()
      .then(blogs => {
        const sortedBlogs = blogs.sort((a, b) =>  {
          return b.likes - a.likes
        })
        console.log(sortedBlogs[0])
        setBlogs( sortedBlogs )
      })
  }, [])

  //check is user logged in
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)

    }
  }, [])

  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    console.log(blogObject)
    blogService.create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        console.log(returnedBlog)
      })
      .catch((error) => {
        setErrorMessage({ type: 'error',
          message: 'unable to like' })
        setTimeout(() => {
          setErrorMessage('') }, 5000
        )
      })
  }

  const handleLikeButton = async (id) => {
    console.log('hit like button')

    const updatedBlog = blogs.find(blog => blog.id === id)
    console.log(id)
    console.log(updatedBlog)
    try {
      const updated = await blogService.like({ title: updatedBlog.title,
        author: updatedBlog.author,
        url: updatedBlog.url,
        likes: updatedBlog.likes }, updatedBlog.id)
      //update dom with like
      console.log(updated)
      const updatedBlogs = blogs.map(blog => blog.id === id ? updated : blog)
      setBlogs(updatedBlogs)
    } catch (exception) {
      setErrorMessage({ type: 'error',
        message: 'unable to like' })

      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleDeleteButton = async (id) => {
    console.log('hit delete button')

    try {
      if (window.confirm('Do you really want to leave?')) {
        await blogService.remove(id)
        // const deleteBlog = blogs.find(blog => blog.id === id)
        const updatedBlogs = blogs.filter(blog => blog.id !== id)
        setBlogs(updatedBlogs)
      }
      return
    } catch (exception) {
      setErrorMessage({ type: 'error',
        message: 'unable to delete' })
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <>
        <Togglable buttonLabel='login'>
          <LoginForm user={user} setUser={setUser} errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
        </Togglable>
      </>
    )
  }
  return (
    <div>
      <Notification errorMessage={errorMessage} />
      <LogoutButton user={user} setUser={setUser}/>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm setErrorMessage={setErrorMessage} createBlog={createBlog}/>
      </Togglable>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} user={user} blog={blog} handleLikeButton={() => handleLikeButton(blog.id)} handleDeleteButton={() => handleDeleteButton(blog.id)}/>
      )}
    </div>
  )
}

export default App