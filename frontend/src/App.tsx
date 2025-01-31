import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SharedRoutes from './routes/sharedRoutes';
import FreelancerRoutes from './routes/freelancerRoutes';
import ClientRoutes from './routes/clientRoutes';
import AdminRoutes from './routes/adminRoutes';

import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <>
    <div><Toaster/></div>
    <Router>
    <Routes>
      <Route path="/client/*" element={<ClientRoutes />} />
      <Route path="/freelancer/*" element={<FreelancerRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/*" element={<SharedRoutes />} />
      
        </Routes>
    </Router>
    </>
  );
};

export default App;
