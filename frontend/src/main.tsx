import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import store from "@store";

import App from "@/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer position="bottom-right" autoClose={2500} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
