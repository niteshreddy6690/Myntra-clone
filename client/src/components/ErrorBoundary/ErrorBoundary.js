import React, { Component } from "react";

import ErrorFallBackUi from "./ErrorFallBackUi.js";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  componentDidCatch(error) {
    this.setState({ error: error });
  }

  render() {
    if (this.state.error) {
      return <ErrorFallBackUi />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
