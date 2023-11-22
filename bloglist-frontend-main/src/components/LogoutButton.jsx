import { useState, useEffect } from 'react'

const LogoutButton = ({ user, setUser }) => {

  const handleLogout = () => {
    // event.preventDefault()
    // blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
    <div>
      {`${user.name} logged in`}
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default LogoutButton