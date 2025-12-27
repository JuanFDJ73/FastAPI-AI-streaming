import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/Home";
import Chat from "./pages/Chat";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* RUTAS PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}