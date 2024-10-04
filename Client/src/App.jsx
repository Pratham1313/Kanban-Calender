import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Components/Auth/login";
import { Toaster } from "react-hot-toast";
import Home from "./Components/Home/home";
import Signup from "./Components/Auth/signup";
import "./App.css";
import { useAuthContext } from "./Components/context/AuthContext";

function App() {
  const { authUser } = useAuthContext(); // Correctly destructure authUser from context

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
