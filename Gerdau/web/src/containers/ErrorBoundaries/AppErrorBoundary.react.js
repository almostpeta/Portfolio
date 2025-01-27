import React from "react";
import { reportError } from "service/error";
import { Button } from "components/Button";
import { Toast } from "components/Toast";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
      isAdminView: props.isAdminView,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  async handleReportError() {
    try {
      reportError({
        error: this.state.error?.toString(),
        errorInfo: this.state.errorInfo,
      });
      alert("Gracias por colaborar! Trabajaremos para solucionar el error");
      this.handleNavigateHome();
    } catch (err) {}
  }

  handleNavigateHome() {
    window.location.href = this.state?.isAdminView ? "/admin/home" : "/home";
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div className="text-center">
          <h2>Parece que ocurrió un error</h2>
          <details
            label="Detalles"
            title="Detalles"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
          <Button onClick={() => this.handleNavigateHome()}>Ir a Inicio</Button>
          <Button className="ml-2" onClick={() => this.handleReportError()}>
            Reportar Error
          </Button>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;
