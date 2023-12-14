import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { Provider } from "react-redux"
import store  from "./store";
import "./indextail.css";
import { StackBarProvider } from "./contexts/managerService";
import { DatePickerProvider } from "./contexts/DatePicker";
import { AuthProvider } from "./contexts/Auth";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <Provider store={store}>
      <BrowserRouter>
        <DatePickerProvider>
          <StackBarProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </StackBarProvider>
        </DatePickerProvider>
      </BrowserRouter>
    </Provider>
  </React.Fragment>
);

serviceWorker.unregister()