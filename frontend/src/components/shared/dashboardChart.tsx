import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axiosConfig from '../../service/axios';

type RevenueData = {
  month?: string;
  quarter?: string;
  year?: string;
  earnings: number;
  projects: number;
  hourly: number;
  fixed: number;
}

type FreelancerActivityData = {
  month?: string;
  quarter?: string;
  year?: string;
  bidsPlaced: number;
  bidsWon: number;
  completion: number;
}

type ClientActivityData = {
  month?: string;
  quarter?: string;
  year?: string;
  requestsSubmitted: number;
  requestsAccepted: number;
}

type RatingData = {
  name: string;
  value: number;
}

type SpendingData = {
  month?: string;
  quarter?: string;
  year?: string;
  spent: number;
  tasks: number;
  ongoing: number;
  completed: number;
}

type TaskStatusData = {
  name: string;
  value: number;
}

type ChartDataType = RevenueData | FreelancerActivityData | ClientActivityData | RatingData | SpendingData | TaskStatusData;

type DashboardData = {
  revenue?: {
    monthly: RevenueData[];
    quarterly: RevenueData[];
    yearly: RevenueData[];
  };
  activity?: {
    monthly: FreelancerActivityData[] | ClientActivityData[];
    quarterly: FreelancerActivityData[] | ClientActivityData[];
    yearly: FreelancerActivityData[] | ClientActivityData[];
  };
  rating?: {
    average: number;
    distribution: Array<{
      rating: number;
      label: string;
      count: number;
    }>;
    total: number;
  };
  spending?: {
    monthly: SpendingData[];
    quarterly: SpendingData[];
    yearly: SpendingData[];
  };
  taskStatus?: {
    distribution: Array<{
      status: string;
      count: number;
      percentage: number;
    }>;
    total: number;
  };
};

const DashboardChart = ({ role }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const [chartType, setChartType] = useState(role === 'freelancer' ? 'revenue' : 'spending');
  const [allChartData, setAllChartData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const updateChartData = (data: DashboardData | null, type: string, period: string) => {
    if (!data) return;
    
    let newData: ChartDataType[] = [];
    
    if (role === 'freelancer') {
      if (type === 'revenue' && data.revenue) {
        newData = data.revenue[period] || [];
      } else if (type === 'activity' && data.activity) {
        newData = data.activity[period] || [];
      } else if (type === 'rating' && data.rating) {
        newData = data.rating.distribution.map(item => ({
          name: item.label,
          value: item.count
        }));
      }
    } else {
      if (type === 'spending' && data.spending) {
        newData = data.spending[period] || [];
      } else if (type === 'activity' && data.activity) {
        newData = data.activity[period] || [];
      } else if (type === 'taskStatus' && data.taskStatus) {
        newData = data.taskStatus.distribution.map(item => ({
          name: item.status,
          value: item.count
        }));
      }
    }
    
    setChartData(newData);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosConfig.get('/users/dashboard-data', {
          params: { role }
        });
        
        const result = response.data.result;
        console.log('Dashboard data:', result);
        setAllChartData(result);
        
        updateChartData(result, chartType, selectedPeriod);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [role]);
  
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    updateChartData(allChartData, chartType, period);
  };
  
  const handleChartTypeChange = (type) => {
    setChartType(type);
    updateChartData(allChartData, type, selectedPeriod);
  };
  
  const renderFreelancerChart = () => {
    const timeKey = selectedPeriod === 'monthly' 
      ? 'month' 
      : selectedPeriod === 'quarterly' 
        ? 'quarter' 
        : 'year';
    
    if (chartType === 'revenue') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={timeKey} />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="earnings" stroke="#0088FE" name="Total Earnings ($)" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="hourly" stroke="#00C49F" name="Hourly Rate ($)" strokeWidth={2} dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="fixed" stroke="#FFBB28" name="Fixed Price ($)" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="projects" stroke="#FF8042" name="Projects" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'activity') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={timeKey} />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="bidsPlaced" fill="#0088FE" name="Bids Placed" />
            <Bar yAxisId="left" dataKey="bidsWon" fill="#00C49F" name="Bids Won" />
            <Line yAxisId="right" type="monotone" dataKey="completion" stroke="#FF8042" name="Completion Rate (%)" strokeWidth={2} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'rating') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} reviews`, 'Count']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    
    return null;
  };
  
  const renderClientChart = () => {
    const timeKey = selectedPeriod === 'monthly' 
      ? 'month' 
      : selectedPeriod === 'quarterly' 
        ? 'quarter' 
        : 'year';
    
    if (chartType === 'spending') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={timeKey} />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="spent" stroke="#0088FE" name="Total Spent ($)" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="tasks" stroke="#FF8042" name="Tasks Posted" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="ongoing" stroke="#FFBB28" name="Ongoing Tasks" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="completed" stroke="#00C49F" name="Completed Tasks" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'activity') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={timeKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="requestsSubmitted" fill="#0088FE" name="Requests Submitted" />
            <Bar dataKey="requestsAccepted" fill="#00C49F" name="Requests Accepted" />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'taskStatus') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    
    return null;
  };

  const calculateSummary = () => {
    if (!chartData.length) return { total: 0, count: 0 };
    
    if (role === 'freelancer' && chartType === 'revenue') {
      return {
        total: chartData.reduce((acc, item) => 
          acc + ((item as RevenueData).earnings || 0), 0),
        count: chartData.reduce((acc, item) => 
          acc + ((item as RevenueData).projects || 0), 0)
      };
    } else if (role === 'client' && chartType === 'spending') {
      return {
        total: chartData.reduce((acc, item) => 
          acc + ((item as SpendingData).spent || 0), 0),
        count: chartData.reduce((acc, item) => 
          acc + ((item as SpendingData).tasks || 0), 0)
      };
    } else if (role === 'client' && chartType === 'activity') {
      return {
        total: chartData.reduce((acc, item) => 
          acc + ((item as ClientActivityData).requestsSubmitted || 0), 0),
        accepted: chartData.reduce((acc, item) => 
          acc + ((item as ClientActivityData).requestsAccepted || 0), 0)
      };
    } else if (role === 'freelancer' && chartType === 'activity') {
      return {
        placed: chartData.reduce((acc, item) => 
          acc + ((item as FreelancerActivityData).bidsPlaced || 0), 0),
        won: chartData.reduce((acc, item) => 
          acc + ((item as FreelancerActivityData).bidsWon || 0), 0)
      };
    }
    
    return { total: 0, count: 0 };
  };
  
  const summary = calculateSummary();
  
  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center h-60">
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }
  
  const hasData = chartData.length > 0;
  if (!hasData && !isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-800 text-lg font-semibold">
            {role === 'freelancer' 
              ? (chartType === 'revenue' ? 'Earnings Overview' : 
                 chartType === 'activity' ? 'Bidding Activity' : 'Client Ratings') 
              : (chartType === 'spending' ? 'Spending Overview' : 
                 chartType === 'activity' ? 'Request Activity' : 'Task Status')}
          </h3>
          {/* Chart type selector */}
          <div className="flex space-x-1">
            {role === 'freelancer' ? (
              <>
                <button 
                  onClick={() => handleChartTypeChange('revenue')} 
                  className={`px-2 py-1 text-xs rounded-md ${chartType === 'revenue' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Earnings
                </button>
                <button 
                  onClick={() => handleChartTypeChange('activity')} 
                  className={`px-2 py-1 text-xs rounded-md ${chartType === 'activity' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Activity
                </button>
                <button 
                  onClick={() => handleChartTypeChange('rating')} 
                  className={`px-2 py-1 text-xs rounded-md ${chartType === 'rating' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Ratings
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleChartTypeChange('spending')} 
                  className={`px-2 py-1 text-xs rounded-md ${chartType === 'spending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Spending
                </button>
                <button 
                  onClick={() => handleChartTypeChange('activity')} 
                  className={`px-2 py-1 text-xs rounded-md ${chartType === 'activity' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Requests
                </button>
                <button 
                  onClick={() => handleChartTypeChange('taskStatus')} 
                  className={`px-2 py-1 text-xs rounded-md ${chartType === 'taskStatus' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Tasks
                </button>
              </>
            )}
          </div>
        </div>
        <div className="h-60 flex items-center justify-center">
          <p className="text-gray-500">No data available for this period</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
        <div>
          <h3 className="text-gray-800 text-lg font-semibold">
            {role === 'freelancer' 
              ? (chartType === 'revenue' ? 'Earnings Overview' : 
                 chartType === 'activity' ? 'Bidding Activity' : 'Client Ratings') 
              : (chartType === 'spending' ? 'Spending Overview' : 
                 chartType === 'activity' ? 'Request Activity' : 'Task Status')}
          </h3>
          <p className="text-gray-400 text-xs">
            {selectedPeriod === 'monthly' ? 'Last 6 Months' : 
             selectedPeriod === 'quarterly' ? 'Last 4 Quarters' : 'Last 3 Years'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <div className="flex space-x-1">
            {role === 'freelancer' ? (
              <>
                <button 
                  onClick={() => handleChartTypeChange('revenue')} 
                  className={`px-2 py-1 text-xs rounded-md ${chartType === 'revenue' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Earnings
                </button>
                <button 
                  onClick={() => handleChartTypeChange('activity')} 
                  className={`px-2 py-1 text-xs rounded-md ${chartType === 'activity' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Activity
                </button>
                <button 
                  onClick={() => handleChartTypeChange('rating')} 
                  className={`px-2 py-1 text-xs rounded-md ${chartType === 'rating' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Ratings
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleChartTypeChange('spending')} 
                  className={`px-2 py-1 text-xs rounded-md ${chartType === 'spending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Spending
                </button>
                <button 
                  onClick={() => handleChartTypeChange('activity')} 
                  className={`px-2 py-1 text-xs rounded-md ${chartType === 'activity' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Requests
                </button>
                <button 
                  onClick={() => handleChartTypeChange('taskStatus')} 
                  className={`px-2 py-1 text-xs rounded-md ${chartType === 'taskStatus' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Tasks
                </button>
              </>
            )}
          </div>
          
          {(chartType !== 'rating' && chartType !== 'taskStatus') && (
            <div className="flex space-x-1">
              <button 
                onClick={() => handlePeriodChange('monthly')} 
                className={`px-2 py-1 text-xs rounded-md ${selectedPeriod === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => handlePeriodChange('quarterly')} 
                className={`px-2 py-1 text-xs rounded-md ${selectedPeriod === 'quarterly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Quarterly
              </button>
              <button 
                onClick={() => handlePeriodChange('yearly')} 
                className={`px-2 py-1 text-xs rounded-md ${selectedPeriod === 'yearly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Yearly
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="h-60">
        {role === 'freelancer' ? renderFreelancerChart() : renderClientChart()}
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        {chartType === 'revenue' && role === 'freelancer' && (
          <>
            <span>Total Earnings: ${summary.total?.toLocaleString()}</span>
            <span>Projects: {summary.count}</span>
          </>
        )}
        
        {chartType === 'spending' && role === 'client' && (
          <>
            <span>Total Spent: ${summary.total?.toLocaleString()}</span>
            <span>Tasks: {summary.count}</span>
          </>
        )}
        
        {chartType === 'activity' && role === 'freelancer' && (
          <>
            <span>Bids Placed: {summary.placed}</span>
            <span>Bids Won: {summary.won}</span>
          </>
        )}
        
        {chartType === 'activity' && role === 'client' && (
          <>
            <span>Requests Submitted: {summary.total}</span>
            <span>Requests Accepted: {summary.accepted}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardChart;