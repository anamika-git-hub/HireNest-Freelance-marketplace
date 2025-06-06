import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight, FaSearch, FaChevronLeft, FaChevronRight as FaChevronRightPage } from 'react-icons/fa';
import Loader from '../../components/shared/Loader';

// Common interface for milestone data
interface Milestone {
  id: string;
  title: string;
  status: 'unpaid' | 'active' | 'completed' | 'paid';
  cost: string;
  dueDate: string;
  paymentDetails?: {
    amount: string;
    platformFee: string;
    netAmount: string;
  };
}

// Common processed contract interface 
interface ProcessedContract {
  id: string;
  title: string;
  budget: string;
  status: 'ongoing' | 'completed';
  nextMilestone?: Milestone;
  completedMilestones: number;
  totalMilestones: number;
  startDate: string;
  // Optional fields for freelancer view
  totalEarned?: string;
  remainingAmount?: string;
  clientName?: string;
}

// Props for the common component
interface ContractsListProps {
  userType: 'client' | 'freelancer';
  fetchDataFn: () => Promise<any[]>;
  processContractFn: (contract: any) => ProcessedContract;
  detailPagePath: string;
}

const ContractsList: React.FC<ContractsListProps> = ({ 
  userType, 
  fetchDataFn, 
  processContractFn,
  detailPagePath 
}) => {
  const [contracts, setContracts] = useState<ProcessedContract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<ProcessedContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'ongoing' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 3;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContractsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await fetchDataFn();
        
        if (data.length === 0) {
          setContracts([]);
          setIsLoading(false);
          return;
        }
        
        setContracts(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch contracts. Please try again later.');
        setIsLoading(false);
        console.error('Error fetching contracts:', err);
      }
    };

    fetchContractsData();
  }, [fetchDataFn]);

  useEffect(() => {
    let result = [...contracts];
    
    if (activeFilter !== 'all') {
      result = result.filter(contract => contract.status === activeFilter);
    }
    
    if (searchTerm) {
      result = result.filter(contract => {
        const titleMatch = contract.title.toLowerCase().includes(searchTerm.toLowerCase());
        // Include client name search for freelancer view
        const clientMatch = contract.clientName ? 
          contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) : 
          false;
        
        return titleMatch || clientMatch;
      });
    }
    
    setFilteredContracts(result);
    setCurrentPage(1); 
  }, [searchTerm, activeFilter, contracts]);

  const totalPages = Math.ceil(filteredContracts.length / ITEMS_PER_PAGE);
  const currentContracts = filteredContracts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const getProgressColor = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    if (percentage < 33) return 'bg-blue-500';
    if (percentage < 66) return 'bg-blue-600';
    return 'bg-blue-700';
  };

  const handleContractClick = (contractId: string) => {
    navigate(`${detailPagePath}/${contractId}`);
  };

  const FilterButton: React.FC<{
    filter: 'all' | 'ongoing' | 'completed';
    label: string;
  }> = ({ filter, label }) => (
    <button
      onClick={() => setActiveFilter(filter)}
      className={`px-4 py-2 rounded-md transition-colors ${
        activeFilter === filter
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  if (isLoading) {
    return userType === 'client' ? 
      <Loader visible={isLoading} /> : 
      <div className="min-h-screen bg-gray-100 pt-20 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-600">Loading contracts...</p>
        </div>
      </div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 py-8 px-4">
      <div className="max-w-6xl mx-auto h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Active Contracts</h1>
        </div>

        {/* Filter and Search Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <FilterButton filter="all" label="All Contracts" />
            <FilterButton filter="ongoing" label="Ongoing" />
            <FilterButton filter="completed" label="Completed" />
          </div>
          <div className="relative w-1/3">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder={userType === 'freelancer' ? 
                "Search contracts by title or client..." : 
                "Search contracts..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Contracts List */}
        <div className="space-y-4">
          {currentContracts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No contracts match your search" : "No contracts found"}
            </div>
          ) : (
            currentContracts.map(contract => (
              <div
                key={contract.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => handleContractClick(contract.id)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex gap-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {contract.title}
                        </h2>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                        contract.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Started: {new Date(contract.startDate).toLocaleDateString()}
                    </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        ${Number(contract.budget).toLocaleString()}
                      </p>
                      {userType === 'freelancer' && contract.totalEarned && (
                        <p className="text-sm text-green-600 font-medium mt-1">
                          Earned: ${Number(contract.totalEarned).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progress: {contract.completedMilestones} of {contract.totalMilestones} milestones
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round((contract.completedMilestones / contract.totalMilestones) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(contract.completedMilestones, contract.totalMilestones)}`}
                        style={{ width: `${(contract.completedMilestones / contract.totalMilestones) * 100}%` }}
                      />
                    </div>
                  </div>

                  {contract.nextMilestone && (
                    <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Next Milestone:</p>
                        <p className="text-gray-900">{contract.nextMilestone.title}</p>
                        <p className="text-sm text-gray-600">
                          Due: {new Date(contract.nextMilestone.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {userType === 'freelancer' ? (
                          <div className="text-right mr-2">
                            <p className="font-medium text-gray-900">
                              ${Number(contract.nextMilestone.cost).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Net: ${(Number(contract.nextMilestone.cost) * 0.9).toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <span className="font-medium text-gray-900 mr-2">
                            ${Number(contract.nextMilestone.cost).toLocaleString()}
                          </span>
                        )}
                        <FaChevronRight className="text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Section */}
        {filteredContracts.length > ITEMS_PER_PAGE && (
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
              <FaChevronRightPage className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractsList;