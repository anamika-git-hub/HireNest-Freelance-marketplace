import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


//---------Shared----------------//
import Home from './pages/shared/Home';
import Login from './pages/shared/Login';
import ForgotPassword from './pages/shared/forgotPassword';
import ResetPassword from './pages/shared/resetPassword';
import Register from './pages/shared/Register';
import OTPVerification from './pages/shared/Otp';
import LayoutWrapper from './components/shared/LayoutWrapper';
import AccountSetup from './pages/shared/accountSetup';
import Dashboard from './pages/shared/Dashboard';
import About from './pages/shared/about';
import Contact from './pages/shared/contact';
import Notifications from './pages/shared/notification';

import Chat from './components/chat/chatPage';

//------------Admin------------------//
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/admin/adminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCategories from './pages/admin/CategoryList';
import CategoryForm from './pages/admin/categoryForm';

//--------------Freelancer--------------//
import MyAccount from './pages/shared/MyAccount';
import FreelancerList from './pages/freelancer/freelancerList';
import FreelancerProfile from './pages/freelancer/freelancerProfile';
import FreelancerDetail from './pages/freelancer/freelancerDetail';
import DashboardFreelancer from './pages/freelancer/dashboardFreelancer';
import ActiveBids from './pages/freelancer/Mybids';
import MyProfile from './pages/freelancer/MyProfile';
import TaskBookmarks from './pages/freelancer/taskBookmarks';

//--------------Clients----------------//
import TaskList from './pages/clients/taskList';
import TaskSubmissionForm from './pages/clients/postTask';
import TaskDetail from './pages/clients/taskDetail';
import MyTaskList from './pages/clients/myTask';
import BiddersList from './pages/clients/bidList';
import TaskDetailForm from './pages/clients/myTaskDetail';
import RequestList from './pages/clients/myRequests';

import FreelancerBookmarks from './pages/clients/freelancerBookamark';

//--------------Others------------------//
import PrivateRoute from './context/adminPrivateRoute';
import UserPrivateRoute from './context/userPrivateRoute';
import UserSidebar from './components/shared/UserSideBar';
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
        <Route path="/forgot-password" element={<LayoutWrapper><ForgotPassword /></LayoutWrapper>} />
        <Route path="/reset-password/:id" element={<LayoutWrapper><ResetPassword /></LayoutWrapper>} />
        <Route path="/register" element={<LayoutWrapper><Register /></LayoutWrapper>} />
        <Route path="/otp" element={<LayoutWrapper><OTPVerification /></LayoutWrapper>} />
        <Route path="/account-setup" element={<LayoutWrapper><AccountSetup /></LayoutWrapper>} />
        <Route path="/settings" element={<UserPrivateRoute><UserSidebar><MyAccount /></UserSidebar></UserPrivateRoute>} />
        <Route path="/dashboard" element={<UserPrivateRoute><UserSidebar><Dashboard /></UserSidebar></UserPrivateRoute>} />
        <Route path="/about" element={<LayoutWrapper><About/></LayoutWrapper>} />
        <Route path="/contact" element={<LayoutWrapper><Contact/></LayoutWrapper>} />
        <Route path="/messages" element={<UserPrivateRoute><UserSidebar><Chat/></UserSidebar></UserPrivateRoute>} />
        <Route path="/notification" element={<UserPrivateRoute><UserSidebar><Notifications/></UserSidebar></UserPrivateRoute>} />

         {/* ---------freelancer--------------- */}
        <Route path="/freelancer/freelancer-profile" element={<LayoutWrapper><FreelancerProfile /></LayoutWrapper>} />
        <Route path="/client/freelancer-list" element={<UserPrivateRoute><LayoutWrapper><FreelancerList/></LayoutWrapper></UserPrivateRoute>} />
        <Route path="/client/freelancer-detail/:id" element={<UserPrivateRoute><LayoutWrapper><FreelancerDetail/></LayoutWrapper></UserPrivateRoute>} />
        <Route path="/freelancer/dashboard" element={<UserPrivateRoute><UserSidebar><DashboardFreelancer/></UserSidebar></UserPrivateRoute>} />
        <Route path="/freelancer/bids" element={<UserPrivateRoute><UserSidebar><ActiveBids/></UserSidebar></UserPrivateRoute>} />
        <Route path="/freelancer/my-profile" element={<UserPrivateRoute><UserSidebar><MyProfile/></UserSidebar></UserPrivateRoute>} />
        <Route path="/task-bookmarks" element={<UserPrivateRoute><UserSidebar><TaskBookmarks/></UserSidebar></UserPrivateRoute>} />

         {/* ----------client-------------------*/}
        <Route path="/client/task-form" element={<UserPrivateRoute><LayoutWrapper><TaskSubmissionForm/></LayoutWrapper></UserPrivateRoute>} />
        <Route path="/freelancer/task-list" element={<UserPrivateRoute><LayoutWrapper><TaskList /></LayoutWrapper></UserPrivateRoute>} />
        <Route path="/freelancer/task-detail/:id" element={<UserPrivateRoute><LayoutWrapper><TaskDetail /></LayoutWrapper></UserPrivateRoute>} />
        <Route path="/client/tasks" element={<UserPrivateRoute><UserSidebar><MyTaskList /></UserSidebar></UserPrivateRoute>} />
        <Route path="/client/bidders-list/:id" element={<UserPrivateRoute><UserSidebar><BiddersList /></UserSidebar></UserPrivateRoute>} />
        <Route path="/client/my-task-detail/:id" element={<UserPrivateRoute><UserSidebar><TaskDetailForm /></UserSidebar></UserPrivateRoute>} />
        <Route path="/client/my-request-list" element={<UserPrivateRoute><UserSidebar><RequestList/></UserSidebar></UserPrivateRoute>} />
        <Route path="/freelancer-bookmarks" element={<UserPrivateRoute><UserSidebar><FreelancerBookmarks/></UserSidebar></UserPrivateRoute>} />

        {/* -----------admin-------------------*/}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<PrivateRoute><AdminLayout><AdminDashboard /></AdminLayout></PrivateRoute>} />
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
