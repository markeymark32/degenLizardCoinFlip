import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { initContract } from "./utils";
import "./globals.css";
import "./styleguide.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import ErrorBoundary from "./components/ErrorBoundary";

window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>,
      document.querySelector("#root")
    );
  })
  .catch(console.error);
