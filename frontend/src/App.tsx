import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/shared/Home';
import Login from './pages/shared/Login';
import Register from './pages/shared/Register';
import OTPVerification from './pages/shared/Otp';
import LayoutWrapper from './components/shared/LayoutWrapper';
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/admin/adminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCategories from './pages/admin/CategoryList';
import FreelancerProfileSetup from './pages/freelancer/profileSetup';
import ClientProfileSetup from './pages/clients/profileSetup';
import SettingsPage from './pages/freelancer/Settings';
import CategoryForm from './pages/admin/categoryForm';
import PrivateRoute from './context/privateRoute';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <>
    <div><Toaster/></div>
    <Router>
      <Routes>
        <Route path="/" element={<LayoutWrapper><Home /></LayoutWrapper>} />
        <Route path="/login" element={<LayoutWrapper><Login /></LayoutWrapper>} />
        <Route path="/register" element={<LayoutWrapper><Register /></LayoutWrapper>} />
        <Route path="/otp" element={<LayoutWrapper><OTPVerification /></LayoutWrapper>} />
        <Route path="/freelancer/profile-setup" element={<PrivateRoute><LayoutWrapper><FreelancerProfileSetup /></LayoutWrapper></PrivateRoute>} />
        <Route path="/freelancer/settings" element={<PrivateRoute><LayoutWrapper><SettingsPage /></LayoutWrapper></PrivateRoute>} />
        <Route path="/client/profile-setup" element={<PrivateRoute><LayoutWrapper><ClientProfileSetup /></LayoutWrapper></PrivateRoute>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        
        <Route
          path="/admin/:type" 
          element={
            <AdminLayout>
              <ManageUsers /> 
            </AdminLayout>
          }
        />
       
        <Route path="/admin/categories" element={<AdminLayout><ManageCategories /></AdminLayout>} />
        <Route path="/admin/categories/new" element={<AdminLayout><CategoryForm /></AdminLayout>} />
        <Route path="/admin/categories/edit/:id" element={<AdminLayout><CategoryForm/></AdminLayout>} />
      </Routes>
    </Router>
    </>
  );
};

export default App;
