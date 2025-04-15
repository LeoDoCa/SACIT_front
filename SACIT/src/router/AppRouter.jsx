import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

import Login from "../auth/Login.jsx";
import LoginWith2FA from "../auth/LoginWith2FA.jsx";
import ResetPassword from "../auth/ResetPassword.jsx";
import Register from "../auth/Register.jsx";

import NotFound from "../pages/404.jsx";
import ServerError from "../pages/500.jsx";

import Home from "../pages/Home.jsx";
import ScheduleAnAppointment from "../pages/ScheduleAnAppointment.jsx";

import ServiceSystem from "../pages/ServiceSystem.jsx";

import ProcedureForm from "../pages/ProcedureForm.jsx";
import ProcedureList from "../pages/ProcedureList.jsx";
import WindowList from "../pages/WindowList.jsx";
import UserForm from "../pages/UserForm.jsx";
import UserList from "../pages/UserList.jsx";
import DateOffTheDay from "../pages/DateOfTheDay.jsx";
import ResetPasswordForm from '../auth/ResetPasswordForm.jsx';
import WindowUsersList from '../pages/WindowUserList.jsx';
import RegularUsersList from '../pages/RegularUserList.jsx';

import TransactionHistory from "../pages/TransactionHistory.jsx";

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || (role && user.role !== role)) {
    return <Navigate to="/" />;
  }
  return children;
};

const UserOrGuestRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return children;
  }

  if (user.role === 'ROLE_USER') {
    return children;
  }

  if (user.role === 'ROLE_ADMIN') {
    return <Navigate to="/date-off-the-day" />;
  } else if (user.role === 'ROLE_WINDOW') {
    return <Navigate to="/service-system" />;
  } else {
    return <Navigate to="/login" />;
  }
};

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<LoginWith2FA />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/500" element={<ServerError />} />

      <Route
        path="/"
        element={
          <UserOrGuestRoute>
            <Home />
          </UserOrGuestRoute>
        }
      />

      <Route
        path="/schedule"
        element={
          <UserOrGuestRoute>
            <ScheduleAnAppointment />
          </UserOrGuestRoute>
        }
      />

      <Route
        path="/history"
        element={
          <PrivateRoute role="ROLE_USER">
            <TransactionHistory />
          </PrivateRoute>
        }
      />

      <Route
        path="/service-system"
        element={
          <PrivateRoute role="ROLE_WINDOW">
            <ServiceSystem />
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
        path="/window-user-list"
        element={
          <PrivateRoute role="ROLE_ADMIN">
            <WindowUsersList />
          </PrivateRoute>
        }
      />
      <Route
        path="/regular-user-list"
        element={
          <PrivateRoute role="ROLE_ADMIN">
            <RegularUsersList />
          </PrivateRoute>
        }
      />
      <Route
        path="/date-of-the-day"
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