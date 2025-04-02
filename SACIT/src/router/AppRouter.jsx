import { Routes, Route } from 'react-router-dom';
import React from 'react';

import Login from "../auth/Login.jsx";
import ResetPassword from "../auth/ResetPassword.jsx";
import Register from "../auth/Register.jsx";

import Home from "../pages/Home.jsx";

import ProcedureForm from "../pages/ProcedureForm.jsx";

const RoutesComponent = () => {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path='/procedure' element={<ProcedureForm />} />
      </Routes>
    );
  };

export default RoutesComponent;