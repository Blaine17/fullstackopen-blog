import { useState } from 'react'

const BlogForm = ({ setErrorMessage, createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const handleBlogSubmit = async (event) => {
    event.preventDefault()
    console.log('post to api/blogs', title, author, url)

    try {
      const response = await createBlog({ title: title,
        author: author,
        url: url })
      setErrorMessage({ type: 'success',
        message:`a new blog ${title} by ${author} added`
      })
      setTitle('')
      setAuthor('')
      setUrl('')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setErrorMessage({ type: 'error',
        message: 'something went wrong' })
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  return (
    <>
      <h1>test</h1>
      <form onSubmit={handleBlogSubmit}>
        <div>
        title:
          <input
            id='title'
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder='title'
          />
        </div>
        <div>
          author:
          <input
            id='author'
            type="author"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='author'
          />
        </div>
        <div>
          url:
          <input
            id='url'
            type="url"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder='link to blog'
          />
        </div>
        <button id='post' type="submit">post</button>
      </form>
    </>
  )
}

export default BlogForm