import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LayoutWrapper from '../components/shared/LayoutWrapper';
import UserPrivateRoute from '../context/userPrivateRoute';
import { UserRoleProvider } from '../context/userRoleContext';

import Home from '../pages/shared/Home';
import Login from '../pages/shared/Login';
import ForgotPassword from '../pages/shared/forgotPassword';
import ResetPassword from '../pages/shared/resetPassword';
import Register from '../pages/shared/Register';
import OTPVerification from '../pages/shared/Otp';
import AccountSetup from '../pages/shared/accountSetup';
import Dashboard from '../pages/shared/Dashboard';
import About from '../pages/shared/about';
import Contact from '../pages/shared/contact';
import Notifications from '../pages/shared/notification';
import Chat from '../components/chat/chatPage';
import MyAccount from '../pages/shared/MyAccount';
import NotFoundPage from '../pages/shared/404';
import VideoCall from '../components/shared/videoCall';
import { io } from 'socket.io-client';
const userId = localStorage.getItem('userId') as string;
const role = localStorage.getItem('role') as string;
const socket = io(process.env.REACT_APP_BASE_URL_NEW, {
  query: { userId, role },
});

const SharedRoutes = () => (
  <Routes>
    <Route path="/" element={<LayoutWrapper><Home /></LayoutWrapper>} />
    <Route path="login" element={<LayoutWrapper><Login /></LayoutWrapper>} />
    <Route path="/forgot-password" element={<LayoutWrapper><ForgotPassword /></LayoutWrapper>} />
    <Route path="/reset-password/:id" element={<LayoutWrapper><ResetPassword /></LayoutWrapper>} />
    <Route path="/register" element={<LayoutWrapper><Register /></LayoutWrapper>} />
    <Route path="/otp" element={<LayoutWrapper><OTPVerification /></LayoutWrapper>} />
    <Route path="/account-setup" element={<LayoutWrapper><AccountSetup /></LayoutWrapper>} />
    <Route path="/settings" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><MyAccount /></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/dashboard" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><Dashboard /></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/about" element={<LayoutWrapper><About/></LayoutWrapper>} />
    <Route path="/contact" element={<LayoutWrapper><Contact/></LayoutWrapper>} />
    <Route path="/404" element={<LayoutWrapper><NotFoundPage/></LayoutWrapper>} />
    <Route path="/messages" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><Chat/></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/notification" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><Notifications/></UserRoleProvider></UserPrivateRoute>} />
    <Route 
  path="/video-call" 
  element={
    <UserPrivateRoute>
      <UserRoleProvider showSidebar={false}>
        <VideoCall socket={socket} userId={userId} role={role}/>
      </UserRoleProvider>
    </UserPrivateRoute>
  } 
/>
    
  </Routes>
);

export default SharedRoutes;
