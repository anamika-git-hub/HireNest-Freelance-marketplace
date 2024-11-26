import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LayoutWrapper from './components/LayoutWrapper';
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/adminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';

const App: React.FC = () => {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<LayoutWrapper><Home /></LayoutWrapper>} />
              <Route path="/login" element={<LayoutWrapper><Login /></LayoutWrapper>} />
              <Route path="/register" element={<LayoutWrapper><Register /></LayoutWrapper>} />
              <Route path="/admin/login" element = {<AdminLayout><AdminLogin/></AdminLayout>}/>
              <Route path="/admin/dashboard" element = {<AdminLayout><Dashboard/></AdminLayout>}/>
              <Route path="/admin/users" element = {<AdminLayout><ManageUsers/></AdminLayout>}/>
          </Routes>
      </Router>
  );
};

export default App;
