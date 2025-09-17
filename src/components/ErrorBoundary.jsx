import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error in component tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-teal-500 text-white p-4">
          <div className="max-w-2xl bg-white/5 rounded-xl p-6 text-left">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <pre className="text-sm whitespace-pre-wrap">{String(this.state.error)}</pre>
            <div className="mt-4 text-sm text-white/80">Open the browser console for more details.</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
