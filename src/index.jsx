import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./featuresRedux/store";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import * as process from "process";
import { SearchProvider } from "./context/SearchContext";
window.global = window;
window.process = process;
window.Buffer = [];

ReactDOM.createRoot(document.getElementById("root")).render(

  <ReduxProvider store={store}>
    <BrowserRouter>
      <SearchProvider>
        <ChakraProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </ChakraProvider>
      </SearchProvider>
    </BrowserRouter>
  </ReduxProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
