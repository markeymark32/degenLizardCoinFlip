import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initContract, NearContext } from "./near";
import "./css/globals.css";
import "./css/styleguide.css";
import "bootstrap/dist/css/bootstrap.min.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

window.nearInitPromise = initContract()
  .then((nearContext) => {
    root.render(
      <React.StrictMode>
        <NearContext.Provider value={nearContext}>
          <App />
        </NearContext.Provider>
      </React.StrictMode>
    );
  })
  .catch(console.error);
