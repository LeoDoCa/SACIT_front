import { Routes, Route } from 'react-router-dom';
import React from 'react';

import Login from "../auth/Login.jsx";
import ResetPassword from "../auth/ResetPassword.jsx";

import Home from "../pages/Home.jsx";


const RoutesComponent = () => {
    return (
      <Routes>
        {/* Rutas de Autentificacion */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Home */}
        <Route path="/" element={<Home />} />
      </Routes>
    );
  };

export default RoutesComponent;