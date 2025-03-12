import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LayoutWrapper from '../components/shared/LayoutWrapper';
import UserPrivateRoute from '../context/userPrivateRoute';
import { UserRoleProvider } from '../context/userRoleContext';

import FreelancerProfile from '../pages/freelancer/freelancerProfile';
import ActiveBids from '../pages/freelancer/Mybids';
import MyProfile from '../pages/freelancer/MyProfile';
import TaskBookmarks from '../pages/freelancer/taskBookmarks';
import RequestList from '../pages/freelancer/requests';
import TaskList from '../pages/clients/taskList';
import TaskDetail from '../pages/clients/taskDetail';
import ContractDetails from '../pages/freelancer/contract';
import FreelancerContractDetails from '../pages/freelancer/OngoingContract';
import FreelancerContractsList from '../pages/freelancer/liveProjects';
import ReviewsList from '../pages/freelancer/reviews';

const FreelancerRoutes = () => (
  <Routes>
    <Route path="/freelancer-profile" element={<LayoutWrapper><FreelancerProfile /></LayoutWrapper>} />
    <Route path="/task-list" element={<UserPrivateRoute><LayoutWrapper><TaskList /></LayoutWrapper></UserPrivateRoute>} />
    <Route path="/task-detail/:id" element={<UserPrivateRoute><LayoutWrapper><TaskDetail /></LayoutWrapper></UserPrivateRoute>} />
    <Route path="/bids" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><ActiveBids/></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/my-profile" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><MyProfile/></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/task-bookmarks" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><TaskBookmarks/></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/requests" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><RequestList/></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/contract/:id" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><ContractDetails/></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/freelancer-contract/:id" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><FreelancerContractDetails/></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/freelancer-contract-list" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><FreelancerContractsList/></UserRoleProvider></UserPrivateRoute>} />
    <Route path="/reviews" element={<UserPrivateRoute><UserRoleProvider showSidebar={true}><ReviewsList/></UserRoleProvider></UserPrivateRoute>} />
  </Routes>
);

export default FreelancerRoutes;
