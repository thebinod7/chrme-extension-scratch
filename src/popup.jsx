import React from "react"
import ReactDOM from "react-dom/client"
import Home from "./pages/Home.jsx";
import Test from './pages/Test.jsx';
import { BrowserRouter, Route, Routes } from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/popup.html" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
