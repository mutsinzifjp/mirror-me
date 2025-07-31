import React from 'react';
import { MirrorSymbol } from './PhilosophicalVisuals';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Mirror Me Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-brand">
              <MirrorSymbol size={64} className="error-symbol" />
              <h2 className="error-app-title">Mirror Me</h2>
            </div>
            <h1>Something went wrong in your journey</h1>
            <p>
              We apologize for this interruption in your philosophical exploration. 
              Your progress has been saved, and you can continue your journey.
            </p>
            <div className="error-actions">
              <button 
                className="primary-action"
                onClick={() => this.setState({ hasError: false })}
              >
                Continue Your Journey
              </button>
              <button 
                className="secondary-action"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Technical Details</summary>
                <pre>{this.state.error?.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
