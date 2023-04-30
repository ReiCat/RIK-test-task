import React from "react";
import { Routes } from "react-router-dom";
import { Route } from "react-router";

import { Router } from "./router";
import { APP_ROUTERS } from "./constants/router";
import PageNotFound from "./pages/PageNotFound";

import "./App.scss";

function App() {
  return (
    <div className="App container">
      <Routes>
        {Router.buildRoutes(APP_ROUTERS)}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
