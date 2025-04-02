import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

import Login from "../auth/Login.jsx";
import ResetPassword from "../auth/ResetPassword.jsx";
import Register from "../auth/Register.jsx";

import Home from "../pages/Home.jsx";
import ScheduleAnAppointment from "../pages/ScheduleAnAppointment.jsx";

import ProcedureForm from "../pages/ProcedureForm.jsx";
import ProcedureList from "../pages/ProcedureList.jsx";
import WindowForm from "../pages/WindowForm.jsx";
import WindowList from "../pages/WindowList.jsx";
import UserForm from "../pages/UserForm.jsx";
import UserList from "../pages/UserList.jsx";
import DateOffTheDay from "../pages/DateOfTheDay.jsx";

import TransactionHistory from "../pages/TransactionHistory.jsx";

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || (role && user.role !== role)) {
    return <Navigate to="/login" />;
  }
  return children;
};

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/schedule" element={<ScheduleAnAppointment />} />

      <Route
        path="/history"
        element={
          <PrivateRoute role={null}>
            <TransactionHistory />
          </PrivateRoute>
        }
      />

      <Route
        path="/procedure-form"
        element={
          <PrivateRoute role="ROLE_ADMIN">
            <ProcedureForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/procedure-list"
        element={
          <PrivateRoute role="ROLE_ADMIN">
            <ProcedureList />
          </PrivateRoute>
        }
      />
      <Route
        path="/window-form"
        element={
          <PrivateRoute role="ROLE_ADMIN">
            <WindowForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/window-list"
        element={
          <PrivateRoute role="ROLE_ADMIN">
            <WindowList />
          </PrivateRoute>
        }
      />
      <Route
        path="/user-form"
        element={
          <PrivateRoute role="ROLE_ADMIN">
            <UserForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/user-list"
        element={
          <PrivateRoute role="ROLE_ADMIN">
            <UserList />
          </PrivateRoute>
        }
      />
      <Route
        path="/date-off-the-day"
        element={
          <PrivateRoute role="ROLE_ADMIN">
            <DateOffTheDay />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default RoutesComponent;