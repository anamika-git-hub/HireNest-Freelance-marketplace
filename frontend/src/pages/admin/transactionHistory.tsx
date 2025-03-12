import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axiosConfig from "../../service/axios";
import { FaChevronLeft, FaChevronRight, FaFileExcel, FaFilePdf, FaSearch } from "react-icons/fa";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TransactionHistory: React.FC = () => {
  const location = useLocation();
  const isSalesReport = location.pathname.includes("sales-report");
  const pageTitle = isSalesReport ? "Sales Report" : "Transaction History";
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState<{
    totalAmount: number;
    totalCommission: number;
    transactionCount: number;
  }>({
    totalAmount: 0,
    totalCommission: 0,
    transactionCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    period: "all",
    startDate: "",
    endDate: "",
  });
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const ITEMS_PER_PAGE = 8;
  
  const inputRef = useRef<HTMLInputElement | null>(null);
  const exportOptionsRef = useRef<HTMLDivElement | null>(null);
  
  // Handle search term debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 600);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  
  // Focus input on search term change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [debouncedSearchTerm]);
  
  // Close export options dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportOptionsRef.current && !exportOptionsRef.current.contains(event.target as Node)) {
        setShowExportOptions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [filter, location.pathname]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let queryParams = "?";
      
      // Add filter params
      if (filter.period !== "all" && filter.period !== "custom") {
        queryParams += `period=${filter.period}&`;
      } else if (filter.period === "custom" && filter.startDate && filter.endDate) {
        queryParams += `startDate=${filter.startDate}&endDate=${filter.endDate}&`;
      }
      
      const response = await axiosConfig.get(`/admin/transaction-history${queryParams}`);
      const data = response.data.result;
      
      setTransactions(data.transactions);
      setSummary(data.summary);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      setLoading(false);
    }
  };

  // Apply client-side filtering based on search term
  useEffect(() => {
    if (!transactions) return;
    
    let result = [...transactions];
    
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter(transaction => 
        transaction.id?.toString().toLowerCase().includes(searchLower) ||
        transaction.client?.toLowerCase().includes(searchLower) ||
        transaction.freelancer?.toLowerCase().includes(searchLower) ||
        transaction.contractTitle?.toLowerCase().includes(searchLower) ||
        transaction.milestoneTitle?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredTransactions(result);
    setCurrentPage(1); 
  }, [debouncedSearchTerm, transactions]);

  let groupedData: Record<string, { amount: number; commission: number; count: number }> = {};
  
  // Group data based on filter period
  (filteredTransactions.length > 0 ? filteredTransactions : transactions).forEach(transaction => {
    const date = new Date(transaction.timestamp || transaction.date);
    let key = '';
    
    if (filter.period === 'weekly' || (filter.period === 'custom' && 
        new Date(filter.endDate).getTime() - new Date(filter.startDate).getTime() <= 7 * 24 * 60 * 60 * 1000)) {
      // Group by day if period is weekly or custom with less than 7 days
      key = date.toISOString().split('T')[0];
    } else if (filter.period === 'monthly' || 
              (filter.period === 'custom' && 
               new Date(filter.endDate).getTime() - new Date(filter.startDate).getTime() <= 31 * 24 * 60 * 60 * 1000)) {
      // Group by date within month for monthly view or custom view with less than a month
      key = date.getDate().toString();
    } else if (filter.period === 'yearly') {
      // Group by month if period is yearly
      key = date.toLocaleString('default', { month: 'short' });
    } else {
      // Default: group by month-year
      key = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
    }
    
    if (!groupedData[key]) {
      groupedData[key] = { amount: 0, commission: 0, count: 0 };
    }
    
    groupedData[key].amount += parseFloat(transaction.amount);
    groupedData[key].commission += parseFloat(transaction.commission);
    groupedData[key].count += 1;
  });
  
  // Convert to array format for chart
  const chartArray = Object.entries(groupedData).map(([name, data]) => ({
    name,
    revenue: parseFloat(data.amount.toFixed(2)),
    commission: parseFloat(data.commission.toFixed(2)),
    transactions: data.count
  }));

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const exportToExcel = () => {
    if (!transactions.length) return;
    
    const workbook = XLSX.utils.book_new();
    
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    
    XLSX.writeFile(workbook, "transactions.xlsx");
    
    console.log("Exported to Excel successfully");
    setShowExportOptions(false);
  };

  const exportToPDF = () => {
    if (!transactions.length) return;
    
    // Using jsPDF and jsPDF-autotable
    const jsPDF = require('jspdf');
    const autoTable = require('jspdf-autotable');
    
    const doc = new jsPDF();
    
    // Add title
    doc.text("Transactions Report", 14, 15);
    
    // Prepare columns and rows for the table
    const columns = Object.keys(transactions[0]).map(key => ({ 
      header: key.charAt(0).toUpperCase() + key.slice(1), 
      dataKey: key 
    }));
    
    // Generate the table
    doc.autoTable({
      columns: columns,
      body: transactions,
      startY: 20,
      styles: { fontSize: 8 },
      columnStyles: { id: { cellWidth: 20 } },
      margin: { top: 20 }
    });
    
    // Save and download the PDF
    doc.save("transactions.pdf");
    
    console.log("Exported to PDF successfully");
    setShowExportOptions(false);
  };
  
  // Calculate pagination values
  const displayedTransactions = filteredTransactions.length > 0 ? filteredTransactions : transactions;
  const totalPages = Math.ceil(displayedTransactions.length / ITEMS_PER_PAGE);
  const currentTransactions = displayedTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  return (
    <div className="bg-white rounded-lg shadow-md p-2 mb-6 select-none">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 lg:mb-0">{pageTitle}</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {isSalesReport && (
            <>
              <div className="flex-1">
                <select
                  name="period"
                  value={filter.period}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              {filter.period === "custom" && (
                <>
                  <div className="flex-1">
                    <input
                      type="date"
                      name="startDate"
                      value={filter.startDate}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="date"
                      name="endDate"
                      value={filter.endDate}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </>
          )}
          
          {isSalesReport && (
            <div className="relative" ref={exportOptionsRef}>
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                disabled={!transactions.length}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 whitespace-nowrap"
              >
                Export ▼
              </button>
              
              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <button
                    onClick={exportToExcel}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 flex items-center"
                  >
                    <FaFileExcel className="mr-2 text-green-600" /> Export as Excel
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 flex items-center"
                  >
                    <FaFilePdf className="mr-2 text-red-600" /> Export as PDF
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Search bar - updated to match client contracts style */}
      <div className="mb-6 relative">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 p-2 border border-gray-300 rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Summary Cards - only for sales report */}
      {isSalesReport && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-sm text-blue-800 font-semibold">Total Transactions</h3>
            <p className="text-2xl font-bold text-blue-900">{summary.transactionCount}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-sm text-green-800 font-semibold">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-900">${Number(summary.totalAmount).toFixed(2)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="text-sm text-purple-800 font-semibold">Total Commission</h3>
            <p className="text-2xl font-bold text-purple-900">${Number(summary.totalCommission).toFixed(2)}</p>
          </div>
        </div>
      )}
      
      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
              <th className="py-3 px-4 text-left">Transaction ID</th>
              <th className="py-3 px-4 text-left">Client</th>
              <th className="py-3 px-4 text-left">Freelancer</th>
              <th className="py-3 px-4 text-left">Contract</th>
              <th className="py-3 px-4 text-left">Milestone</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-right">Commission</th>
              <th className="py-3 px-4 text-right">Net Amount</th>
              <th className="py-3 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : currentTransactions.length > 0 ? (
              currentTransactions.map((transaction, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4">{transaction.id}</td>
                  <td className="py-3 px-4">{transaction.client}</td>
                  <td className="py-3 px-4">{transaction.freelancer}</td>
                  <td className="py-3 px-4">{transaction.contractTitle}</td>
                  <td className="py-3 px-4">{transaction.milestoneTitle}</td>
                  <td className="py-3 px-4 text-right">${transaction.amount}</td>
                  <td className="py-3 px-4 text-right">${transaction.commission}</td>
                  <td className="py-3 px-4 text-right">${transaction.netAmount}</td>
                  <td className="py-3 px-4">{transaction.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-4 text-center text-gray-500">
                  {searchTerm ? "No transactions match your search" : "No transactions found for the selected period"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination - using the same style as ClientContractsList */}
      {displayedTransactions.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(pageNumber => {
              if (pageNumber === 1 || pageNumber === totalPages) return true;
              if (Math.abs(pageNumber - currentPage) <= 2) return true;
              return false;
            })
            .map((page, index, array) => {
              if (index > 0 && array[index] - array[index - 1] > 1) {
                return (
                  <React.Fragment key={`ellipsis-${page}`}>
                    <span className="w-8 h-8 flex items-center justify-center text-gray-700">
                      ...
                    </span>
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        page === currentPage
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    page === currentPage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;