import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/shared/Home';
import Login from './pages/shared/Login';
import Register from './pages/shared/Register';
import OTPVerification from './pages/shared/Otp';
import LayoutWrapper from './components/LayoutWrapper';
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/admin/adminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCategories from './pages/admin/CategoryList';
import FreelancerProfileSetup from './pages/freelancer/profileSetup';
import ClientProfileSetup from './pages/clients/profileSetup';
import SettingsPage from './pages/freelancer/Settings';

const App: React.FC = () => {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<LayoutWrapper><Home /></LayoutWrapper>} />
              <Route path="/login" element={<LayoutWrapper><Login /></LayoutWrapper>} />
              <Route path="/register" element={<LayoutWrapper><Register /></LayoutWrapper>} />
              <Route path="/otp" element={<LayoutWrapper><OTPVerification/></LayoutWrapper>}/>
              <Route path='/freelancer/profile-setup' element={<LayoutWrapper><FreelancerProfileSetup/></LayoutWrapper>}/>
              <Route path='/freelancer/settings' element={<LayoutWrapper><SettingsPage/></LayoutWrapper>}/>

              <Route path='/client/profile-setup' element={<LayoutWrapper><ClientProfileSetup/></LayoutWrapper>}/>

              <Route path="/admin/login" element = {<AdminLogin/>}/>
              <Route path="/admin/dashboard" element = {<AdminLayout><Dashboard/></AdminLayout>}/>
              <Route path="/admin/users" element = {<AdminLayout><ManageUsers/></AdminLayout>}/>
              <Route path="/admin/categories" element = {<AdminLayout><ManageCategories/></AdminLayout>}/>
          </Routes>
      </Router>
  );
};

export default App;
