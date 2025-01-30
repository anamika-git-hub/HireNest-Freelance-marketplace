import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LayoutWrapper from '../components/shared/LayoutWrapper';
import UserPrivateRoute from '../context/userPrivateRoute';
import { UserRoleProvider } from '../context/userRoleContext';

import TaskSubmissionForm from '../pages/clients/postTask';
import MyTaskList from '../pages/clients/myTask';
import BiddersList from '../pages/clients/bidList';
import TaskDetailForm from '../pages/clients/myTaskDetail';
import MyRequestList from '../pages/clients/myRequests';
import MilestoneSection from '../components/client/MileStoneSection';
import FreelancerBookmarks from '../pages/clients/freelancerBookamark';
import FreelancerList from '../pages/freelancer/freelancerList';
import FreelancerDetail from '../pages/freelancer/freelancerDetail';

const ClientRoutes = () => (
  <Routes>
    <Route path="/task-form" element={<UserPrivateRoute><LayoutWrapper><TaskSubmissionForm/></LayoutWrapper></UserPrivateRoute>} />
    <Route path="/freelancer-list" element={<UserPrivateRoute><LayoutWrapper><FreelancerList/></LayoutWrapper></UserPrivateRoute>} />
    <Route path="/freelancer-detail/:id" element={<UserPrivateRoute><LayoutWrapper><FreelancerDetail/></LayoutWrapper></UserPrivateRoute>} />
    <Route path="/tasks" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><MyTaskList /></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/bidders-list/:id" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><BiddersList /></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/my-task-detail/:id" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><TaskDetailForm /></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/my-request-list" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><MyRequestList/></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/freelancer-bookmarks" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><FreelancerBookmarks/></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/send-offer" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><MilestoneSection/></UserRoleProvider></UserPrivateRoute>} />
  </Routes>
);

export default ClientRoutes;
