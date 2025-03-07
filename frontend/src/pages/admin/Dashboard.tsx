import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaUserTie, FaUser, FaClipboardList, FaChartLine, FaCog, FaShieldAlt, FaFileInvoiceDollar } from 'react-icons/fa';
import { MdAssignment, MdPayment, MdVerifiedUser, MdBlock } from 'react-icons/md';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axiosConfig from '../../service/axios';

const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for dashboard data
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeClients: 0,
    activeFreelancers: 0,
    pendingVerifications: 0,
    totalProjects: 0,
    ongoingProjects: 0,
    completedProjects: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    platformCommission: 0
  });
  
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  // Handle user verification
  const handleVerification = async (userId: string, action: 'approve' | 'reject') => {
    try {
      const response = await axiosConfig.post('/admin/verify-user', {
        userId,
        action
      });
      
      // Update the state to remove the processed verification
      setPendingVerifications(prev => prev.filter(user => user.id !== userId));
      
      // Refresh dashboard stats
      getDashboardData();
    } catch (error) {
      console.error('Error processing verification:', error);
      setError('Failed to process verification');
    }
  };

  // Fetch dashboard data
  const getDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosConfig.get('/admin/dashboard');
      const data = response.data.result;
      console.log('dddd',data)
      // Update all state variables with fetched data
      setStats(data.stats);
      setRevenueData(data.revenueData);
      setUserGrowthData(data.userGrowthData);
      setCategoryData(data.categoryData);
      setRecentTransactions(data.recentTransactions);
      setPendingVerifications(data.pendingVerifications);
      setRecentProjects(data.recentProjects);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
    
    // Set up refresh interval (every 5 minutes)
    const interval = setInterval(getDashboardData, 5 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Handle period change
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    // In a real implementation, this would filter the data based on the selected period
    // or make a new API call with the period as a parameter
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Card component for statistics
  const StatCard = ({ icon, title, value, footer, color }) => (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      <div className="flex items-center mb-2">
        <div className={`p-2 rounded-full ${color} text-white mr-3`}>
          {icon}
        </div>
        <span className="text-gray-700 font-medium">{title}</span>
      </div>
      <div className="text-2xl font-bold my-2">{value}</div>
      {footer && <div className="text-xs text-gray-500 mt-2">{footer}</div>}
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-100 p-6 rounded-lg">
          <p className="text-red-600 font-semibold">{error}</p>
          <button 
            onClick={getDashboardData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="h-screen overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your marketplace metrics and activities</p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={<FaDollarSign />} 
            title="Total Revenue" 
            value={`$${stats.totalRevenue.toLocaleString()}`}
            footer="Lifetime marketplace revenue" 
            color="bg-green-500"
          />
          <StatCard 
            icon={<FaDollarSign />} 
            title="Commission Earned" 
            value={`$${stats.platformCommission.toLocaleString()}`}
            footer="Your 10% platform fee" 
            color="bg-blue-500"
          />
          <StatCard 
            icon={<FaClipboardList />} 
            title="Active Projects" 
            value={stats.ongoingProjects}
            footer={`${stats.completedProjects} completed projects`} 
            color="bg-purple-500"
          />
          <StatCard 
            icon={<MdVerifiedUser />} 
            title="Pending Verifications" 
            value={stats.pendingVerifications}
            footer="Awaiting your review" 
            color="bg-yellow-500"
          />
        </div>
        
        {/* Revenue Graph */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Revenue Overview</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => handlePeriodChange('monthly')}
                className={`px-3 py-1 text-sm rounded-md ${selectedPeriod === 'monthly' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => handlePeriodChange('quarterly')}
                className={`px-3 py-1 text-sm rounded-md ${selectedPeriod === 'quarterly' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'}`}
              >
                Quarterly
              </button>
              <button 
                onClick={() => handlePeriodChange('yearly')}
                className={`px-3 py-1 text-sm rounded-md ${selectedPeriod === 'yearly' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'}`}
              >
                Yearly
              </button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#0088FE" name="Total Revenue ($)" strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="commission" stroke="#00C49F" name="Commission ($)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="projects" stroke="#FF8042" name="Projects" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Two graphs in a row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">User Growth</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userGrowthData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="clients" fill="#8884d8" name="Clients" />
                  <Bar dataKey="freelancers" fill="#82ca9d" name="Freelancers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Project Categories Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Project Categories</h2>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
            <button className="text-blue-500 hover:text-blue-700 text-sm">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
                  <th className="py-3 px-4 text-left">Transaction ID</th>
                  <th className="py-3 px-4 text-left">Client</th>
                  <th className="py-3 px-4 text-left">Freelancer</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Commission (10%)</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-4">{transaction.id}</td>
                      <td className="py-3 px-4">{transaction.client}</td>
                      <td className="py-3 px-4">{transaction.freelancer}</td>
                      <td className="py-3 px-4 text-right">${transaction.amount}</td>
                      <td className="py-3 px-4 text-right">${transaction.commission}</td>
                      <td className="py-3 px-4">{transaction.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">No recent transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Verification Requests */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Pending Verifications</h2>
              <button className="text-blue-500 hover:text-blue-700 text-sm">View All</button>
            </div>
            <div className="overflow-y-auto max-h-60">
              {pendingVerifications.length > 0 ? (
                pendingVerifications.map((user, index) => (
                  <div key={index} className="border-b border-gray-200 py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">ID: {user.id} • {user.type}</p>
                      <p className="text-xs text-gray-400">Submitted: {user.submittedDate}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleVerification(user.id, 'approve')}
                        className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleVerification(user.id, 'reject')}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-500">No pending verifications</div>
              )}
            </div>
          </div>
          
          {/* Recent Projects */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Projects</h2>
              <button className="text-blue-500 hover:text-blue-700 text-sm">View All</button>
            </div>
            <div className="overflow-y-auto max-h-60">
              {recentProjects.length > 0 ? (
                recentProjects.map((project, index) => (
                  <div key={index} className="border-b border-gray-200 py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-gray-500">Client: {project.client}</p>
                        <p className="text-xs text-gray-400">ID: {project.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${project.budget}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-500">No recent projects</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;