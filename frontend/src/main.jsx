import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { Provider } from "./Provider/Provider.jsx";
import CallPopup from "./components/CallPopUp/CallPopUp.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <App />
        <CallPopup />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
