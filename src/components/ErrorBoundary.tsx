'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import Icon from '@/components/AppIcon';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// allow global handler
declare global {
  interface Window {
    __COMPONENT_ERROR__?: (err: Error, info: ErrorInfo) => void;
  }
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    (error as any).__ErrorBoundary = true;
    window.__COMPONENT_ERROR__?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center p-8 max-w-md">
            <div className="flex justify-center items-center mb-2">
              {/* sad-face icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="42"
                height="42"
                viewBox="0 0 32 33"
                fill="none"
              >
                <path
                  d="M16 28.5C22.6274 28.5 28 23.1274 28 16.5C28 9.87258 22.6274 4.5 16 4.5C9.37258 4.5 4 9.87258 4 16.5C4 23.1274 9.37258 28.5 16 28.5Z"
                  stroke="#343330"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path d="M11.5 15.5c.828 0 1.5-.672 1.5-1.5S12.328 12.5 11.5 12.5 10 13.172 10 14s.672 1.5 1.5 1.5Z" fill="#343330" />
                <path d="M20.5 15.5c.828 0 1.5-.672 1.5-1.5S21.328 12.5 20.5 12.5 19 13.172 19 14s.672 1.5 1.5 1.5Z" fill="#343330" />
                <path
                  d="M21 22.5C19.962 20.706 18.221 19.5 16 19.5c-2.222 0-3.963 1.206-5 3"
                  stroke="#343330"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-2xl font-medium text-neutral-800">
                Something went wrong
              </h1>
              <p className="text-neutral-600 text-base">
                We encountered an unexpected error while processing your request.
              </p>
            </div>
            <div className="flex justify-center items-center mt-6">
              <button
                onClick={() => (window.location.href = '/')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 transition-colors duration-200 shadow-sm"
              >
                <Icon name="ArrowLeft" size={18} color="#fff" />
                Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
