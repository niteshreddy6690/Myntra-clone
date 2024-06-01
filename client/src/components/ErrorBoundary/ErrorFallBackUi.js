import React from "react";
import { Link } from "react-router-dom";

const ErrorFallBackUi = () => {
  return (
    <div>
      <div>
        <h1>OOps.. Something went Wrong </h1>
        <p1>connect with administrator</p1>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default ErrorFallBackUi;
