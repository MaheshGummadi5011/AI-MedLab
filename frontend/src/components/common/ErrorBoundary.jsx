import React from "react";
import { Alert, Container, Box, Button } from "@mui/material";

// ✅ NEW: Error Boundary component to catch React errors and display user-friendly messages
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ textAlign: "center" }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              <strong>Oops! Something went wrong</strong>
              <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
              <small style={{ opacity: 0.7 }}>
                Error: {this.state.error?.message || "Unknown error"}
              </small>
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={this.resetError}
              sx={{ mr: 1 }}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
