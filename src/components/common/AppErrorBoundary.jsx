import { Component } from 'react'
import ErrorPage from '../../pages/ErrorPage'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application error boundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          code="500"
          title="The app hit an unexpected issue"
          message="Please reload the page. If the issue keeps happening, sign in again after a refresh."
          details={this.state.error?.message || ''}
          primaryActionLabel="Reload app"
          onPrimaryAction={this.handleReload}
        />
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary