import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

//---------Shared----------------//
import Home from './pages/shared/Home';
import Login from './pages/shared/Login';
import Register from './pages/shared/Register';
import OTPVerification from './pages/shared/Otp';
import LayoutWrapper from './components/shared/LayoutWrapper';

//------------Admin------------------//
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/admin/adminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCategories from './pages/admin/CategoryList';
import CategoryForm from './pages/admin/categoryForm';

//--------------Freelancer--------------//
import FreelancerProfileSetup from './pages/freelancer/profileSetup';
import SettingsPage from './pages/freelancer/Settings';
import TaskList from './pages/freelancer/taskList';
import FreelancerProfile from './pages/freelancer/freelancerProfile';

//--------------Clients----------------//
import ClientProfileSetup from './pages/clients/profileSetup';
import TaskSubmissionForm from './pages/clients/postTask';
import FreelancerList from './pages/clients/freelancerList';

//--------------Others------------------//
import PrivateRoute from './context/privateRoute';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <>
    <div><Toaster/></div>
    <Router>
      <Routes>
        {/* ---------shared ------------------*/}
        <Route path="/" element={<LayoutWrapper><Home /></LayoutWrapper>} />
        <Route path="/login" element={<LayoutWrapper><Login /></LayoutWrapper>} />
        <Route path="/register" element={<LayoutWrapper><Register /></LayoutWrapper>} />
        <Route path="/otp" element={<LayoutWrapper><OTPVerification /></LayoutWrapper>} />

         {/* ---------freelancer--------------- */}
        <Route path="/freelancer/profile-setup" element={<LayoutWrapper><FreelancerProfileSetup /></LayoutWrapper>} />
        <Route path="/freelancer/settings" element={<LayoutWrapper><SettingsPage /></LayoutWrapper>} />
        <Route path="/freelancer/task-list" element={<LayoutWrapper><TaskList /></LayoutWrapper>} />
        <Route path="/freelancer/freelancer-profile" element={<LayoutWrapper><FreelancerProfile /></LayoutWrapper>} />

         {/* ----------client-------------------*/}
        <Route path="/client/profile-setup" element={<LayoutWrapper><ClientProfileSetup /></LayoutWrapper>} />
        <Route path="/client/task-form" element={<LayoutWrapper><TaskSubmissionForm/></LayoutWrapper>} />
        <Route path="/client/freelancer-list" element={<LayoutWrapper><FreelancerList/></LayoutWrapper>} />

        {/* -----------admin-------------------*/}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<PrivateRoute><AdminLayout><Dashboard /></AdminLayout></PrivateRoute>} />
        <Route path="/admin/:type" element={<PrivateRoute><AdminLayout><ManageUsers /> </AdminLayout></PrivateRoute>}/>
        <Route path="/admin/categories" element={<PrivateRoute><AdminLayout><ManageCategories /></AdminLayout></PrivateRoute>} />
        <Route path="/admin/categories/new" element={<PrivateRoute><AdminLayout><CategoryForm /></AdminLayout></PrivateRoute>} />
        <Route path="/admin/categories/edit/:id" element={<PrivateRoute><AdminLayout><CategoryForm/></AdminLayout></PrivateRoute>} />

      </Routes>
    </Router>
    </>
  );
};

export default App;
