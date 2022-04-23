import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { initContract } from "./utils";
import "./globals.css";
import "./styleguide.css";
import 'bootstrap/dist/css/bootstrap.min.css';

window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
        <App />,
      document.querySelector("#root")
    );
  })
  .catch(console.error);
