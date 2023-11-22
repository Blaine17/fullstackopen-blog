import { useState } from 'react'


const Blog = ({ user, blog, handleLikeButton, handleDeleteButton }) => {

  const [preview, setPreview] = useState(true)

  const handleButtonClick = () => {
    setPreview(!preview)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (preview) {
    return (
      <div className='blog' style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={handleButtonClick}>view</button>
      </div>
    )
  } else {
    return (
      <div className='blog' style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={handleButtonClick}>hide</button>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>{blog.likes}
          <button onClick={handleLikeButton}>like</button>
        </div>
        {blog.user.name}
        <div>
          {user.username === blog.user.username
            ? <button onClick={handleDeleteButton}>Remove </button>
            : <div></div>}
        </div>
      </div>
    )
  }
}

export default Blog