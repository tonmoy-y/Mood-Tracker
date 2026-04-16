import ErrorPage from './ErrorPage'

const NotFoundPage = () => {
  return (
    <ErrorPage
      code="404"
      title="This route is not available"
      message="The address may be mistyped, or the page has moved. Use reload or return to home."
      primaryActionLabel="Reload page"
    />
  )
}

export default NotFoundPage
