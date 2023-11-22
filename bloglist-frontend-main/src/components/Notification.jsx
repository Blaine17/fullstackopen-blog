const Notification = ({ errorMessage }) => {
  console.log(errorMessage)

  if (errorMessage === '') {
    return (
      <div></div>
    )
  } else {
    return (
      <div className={errorMessage.type}>{errorMessage.message}</div>
    )
  }
}

export default Notification