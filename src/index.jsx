import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./featuresRedux/store";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <ChakraProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </ChakraProvider>
      </BrowserRouter>
    </ReduxProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
