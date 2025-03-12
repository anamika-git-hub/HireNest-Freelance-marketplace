import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from '../context/adminPrivateRoute';

import AdminLogin from '../pages/admin/Login';
import AdminLayout from '../components/admin/adminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageCategories from '../pages/admin/CategoryList';
import CategoryForm from '../pages/admin/categoryForm';
import TransactionHistory from '../pages/admin/transactionHistory';

const AdminRoutes = () => (
    <Routes>
    <Route path="/login" element={<AdminLogin />} />
    <Route path="/dashboard" element={<PrivateRoute><AdminLayout><AdminDashboard /></AdminLayout></PrivateRoute>} />
    <Route path="/:type" element={<PrivateRoute><AdminLayout><ManageUsers /> </AdminLayout></PrivateRoute>}/>
    <Route path="/categories" element={<PrivateRoute><AdminLayout><ManageCategories /></AdminLayout></PrivateRoute>} />
    <Route path="/categories/new" element={<PrivateRoute><AdminLayout><CategoryForm /></AdminLayout></PrivateRoute>} />
    <Route path="/categories/edit/:id" element={<PrivateRoute><AdminLayout><CategoryForm/></AdminLayout></PrivateRoute>} />
    <Route path="/transaction-history" element={<PrivateRoute><AdminLayout><TransactionHistory/></AdminLayout></PrivateRoute>} />
    <Route path="/sales-report" element={<PrivateRoute><AdminLayout><TransactionHistory/></AdminLayout></PrivateRoute>} />
    </Routes>
)

export default AdminRoutes;

