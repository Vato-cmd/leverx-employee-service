import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import "./styles.scss";
import { store } from "./store/store";
import { loginSuccess } from "./store/authSlice";

const storedUser =
  sessionStorage.getItem("user") || localStorage.getItem("user");

if (storedUser) {
  store.dispatch(loginSuccess(JSON.parse(storedUser)));
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
