import React from 'react';
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    // This lifecycle method is called after an error has been thrown by a descendant component.
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error: error };
    }
    // This lifecycle method is called after an error has been thrown.
    // It receives the error and information about the component stack.
    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({
            errorInfo: errorInfo
        });
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (<div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-white p-4">
          <div className="card bg-danger text-white p-4 shadow-lg text-center mx-auto" style={{ maxWidth: '600px' }}>
            <div className="card-body">
              <h2 className="card-title h4 fw-bold mb-3">Something went wrong.</h2>
              <p className="card-text mb-3">
                We're sorry, but an unexpected error occurred. Please try refreshing the page.
              </p>
              {/* Optional: Display error details in development for debugging */}
              {this.state.error && (<details className="text-start bg-dark p-3 rounded mt-3">
                  <summary className="h6 text-warning cursor-pointer">Error Details</summary>
                  <pre className="text-light small mt-2 overflow-auto" style={{ maxHeight: '200px' }}>
                    {this.state.error.toString()}
                    <br />
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>)}
              <button onClick={() => window.location.reload()} className="btn btn-light mt-4">
                Refresh Page
              </button>
            </div>
          </div>
        </div>);
        }
        // If there's no error, render the children components normally
        return this.props.children;
    }
}
export default ErrorBoundary;
