import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            margin: "var(--spacing-lg)",
            padding: "var(--spacing-lg)",
            background: "var(--color-danger-bg)",
            border: "1px solid var(--color-danger)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <h2 style={{ color: "var(--color-danger)", margin: 0 }}>Something went wrong</h2>
          <p className="text-muted" style={{ marginTop: "var(--spacing-sm)", marginBottom: 0 }}>
            Try reloading the app. If the problem continues, check the details below.
          </p>
          <details style={{ whiteSpace: "pre-wrap", marginTop: "var(--spacing-md)", fontSize: "var(--font-size-sm)" }}>
            {this.state.error?.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
