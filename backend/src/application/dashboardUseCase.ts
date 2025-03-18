import { AccountDetailRepository } from '../infrastructure/repositories/accountDetail';
import { BidRepository } from '../infrastructure/repositories/BidRepository';
import { ContractRepository } from '../infrastructure/repositories/contractRepository';
import { FreelancerProfileRepository } from '../infrastructure/repositories/FreelancerProfileRepository';
import { FreelancerReviewRepository } from '../infrastructure/repositories/freelancerReviewRepository';
import { RequestRepository } from '../infrastructure/repositories/RequestRepository';
import { TaskRepository } from '../infrastructure/repositories/TaskRepository';

interface MonthlyIdentifier {
  year: number;
  month: number;
}

interface QuarterlyIdentifier {
  year: number;
  quarter: number;
}

interface YearlyIdentifier {
  year: number;
}
interface FreelancerEarning {
  _id: MonthlyIdentifier | QuarterlyIdentifier | YearlyIdentifier;
  earnings: number;
  projects: number;
  hourly: number;
  fixed: number;
}

interface FreelancerBid {
  _id: MonthlyIdentifier | QuarterlyIdentifier | YearlyIdentifier;
  bidsPlaced: number;
  bidsWon: number;
}

interface TaskCompletionStat {
  _id: MonthlyIdentifier;
  completion: number;
}

interface FreelancerRating {
  _id: number;
  count: number;
}

interface ClientSpending {
  _id: MonthlyIdentifier | QuarterlyIdentifier | YearlyIdentifier;
  spent: number;
  tasks: number;
  ongoing: number;
  completed: number;
}

interface ClientProposal {
  _id: MonthlyIdentifier | QuarterlyIdentifier | YearlyIdentifier;
  proposals: number;
  shortlisted: number;
  hired: number;
}

interface ClientRequest {
  _id: MonthlyIdentifier | QuarterlyIdentifier | YearlyIdentifier;
  requestsSubmitted: number;
  requestsAccepted: number;
}

interface ClientRequestData {
  monthlyRequests: ClientRequest[];
  quarterlyRequests: ClientRequest[];
  yearlyRequests: ClientRequest[];
}

interface FormattedClientActivity {
  month?: string;
  quarter?: string;
  year?: string;
  requestsSubmitted: number;
  requestsAccepted: number;
}

interface TaskStatusDistribution {
  _id: string;
  count: number;
}

interface FreelancerEarningsData {
  monthlyEarnings: FreelancerEarning[];
  quarterlyEarnings: FreelancerEarning[];
  yearlyEarnings: FreelancerEarning[];
  taskCompletionStats: TaskCompletionStat[];
}

interface FreelancerBidData {
  monthlyBids: FreelancerBid[];
  quarterlyBids: FreelancerBid[];
  yearlyBids: FreelancerBid[];
}

interface ClientSpendingData {
  monthlySpending: ClientSpending[];
  quarterlySpending: ClientSpending[];
  yearlySpending: ClientSpending[];
  taskStatusDistribution: TaskStatusDistribution[];
}

interface ClientProposalData {
  monthlyProposals: ClientProposal[];
  quarterlyProposals: ClientProposal[];
  yearlyProposals: ClientProposal[];
}

interface FormattedFreelancerRevenue {
  month?: string;
  quarter?: string;
  year?: string;
  earnings: number;
  projects: number;
  hourly: number;
  fixed: number;
}

interface FormattedFreelancerActivity {
  month?: string;
  quarter?: string;
  year?: string;
  bidsPlaced: number;
  bidsWon: number;
  completion: number;
}

interface FormattedRatingItem {
  rating: number;
  label: string;
  count: number;
}

interface FormattedRatingData {
  distribution: FormattedRatingItem[];
  average: number;
  total: number;
}

interface FormattedClientSpending {
  month?: string;
  quarter?: string;
  year?: string;
  spent: number;
  tasks: number;
  ongoing: number;
  completed: number;
}

interface FormattedClientProposals {
  month?: string;
  quarter?: string;
  year?: string;
  proposals: number;
  shortlisted: number;
  hired: number;
}

interface FormattedTaskStatus {
  status: string;
  count: number;
  percentage: number;
}

interface FormattedTaskStatusData {
  distribution: FormattedTaskStatus[];
  total: number;
}

interface FreelancerDashboardData {
  revenue: {
    monthly: FormattedFreelancerRevenue[];
    quarterly: FormattedFreelancerRevenue[];
    yearly: FormattedFreelancerRevenue[];
  };
  activity: {
    monthly: FormattedFreelancerActivity[];
    quarterly: FormattedFreelancerActivity[];
    yearly: FormattedFreelancerActivity[];
  };
  rating: FormattedRatingData;
}

interface ClientDashboardData {
  spending: {
    monthly: FormattedClientSpending[];
    quarterly: FormattedClientSpending[];
    yearly: FormattedClientSpending[];
  };
  activity: {
    monthly: FormattedClientActivity[];
    quarterly: FormattedClientActivity[];
    yearly: FormattedClientActivity[];
  };
  taskStatus: FormattedTaskStatusData;
}

export const DashboardUseCase = {
   getUserDashboardStats: async (userId: string, userRole: string): Promise<FreelancerDashboardData | ClientDashboardData> => {
   
    const currentDate = new Date();
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (userRole === 'freelancer') {
      const freelancerProfile = await FreelancerProfileRepository.getFreelancerByUserId(userId);
           const uniqueId = freelancerProfile ? freelancerProfile._id.toString() : null;
           if(!uniqueId)throw new Error('freelancer is not found')
      const { monthlyEarnings, quarterlyEarnings, yearlyEarnings, taskCompletionStats } = 
        await ContractRepository.getFreelancerEarnings(uniqueId, threeYearsAgo, currentDate);
      
      const { monthlyBids, quarterlyBids, yearlyBids } = 
        await BidRepository.getFreelancerBidStats(userId, threeYearsAgo, currentDate);
      
      const ratingsData = await FreelancerReviewRepository.getFreelancerRatings(uniqueId);
      
      const monthlyData = formatFreelancerMonthlyData(monthlyEarnings, monthlyBids, taskCompletionStats, monthNames);
      const quarterlyData = formatFreelancerQuarterlyData(quarterlyEarnings, quarterlyBids);
      const yearlyData = formatFreelancerYearlyData(yearlyEarnings, yearlyBids);
      const ratingData = formatRatingData(ratingsData);
      
      return {
        revenue: {
          monthly: monthlyData.revenue,
          quarterly: quarterlyData.revenue,
          yearly: yearlyData.revenue
        },
        activity: {
          monthly: monthlyData.activity,
          quarterly: quarterlyData.activity,
          yearly: yearlyData.activity
        },
        rating: ratingData
      };
    } else if (userRole === 'client') {
        const accountDetail = await AccountDetailRepository.findUserDetailsById(userId);
        const uniqueId = accountDetail ? accountDetail._id.toString() : null;
        if(!uniqueId)throw new Error('client is not found')
        const { monthlySpending, quarterlySpending, yearlySpending, taskStatusDistribution } = 
        await ContractRepository.getClientSpending(uniqueId, threeYearsAgo, currentDate);
      
        const { monthlyRequests, quarterlyRequests, yearlyRequests } = 
        await RequestRepository.getClientRequestStats(userId, threeYearsAgo, currentDate);
      
        const monthlyData = formatClientMonthlyData(monthlySpending, monthlyRequests, monthNames);
        const quarterlyData = formatClientQuarterlyData(quarterlySpending, quarterlyRequests);
        const yearlyData = formatClientYearlyData(yearlySpending, yearlyRequests);
        const taskStatusData = formatTaskStatusData(taskStatusDistribution);
      
      return {
        spending: {
          monthly: monthlyData.spending,
          quarterly: quarterlyData.spending,
          yearly: yearlyData.spending
        },
        activity: { 
          monthly: monthlyData.activity,
          quarterly: quarterlyData.activity,
          yearly: yearlyData.activity
        },
        taskStatus: taskStatusData
      };
    }
    
    throw new Error('Invalid user role');
  }
};

function formatFreelancerMonthlyData(
  earnings: FreelancerEarning[], 
  bids: FreelancerBid[], 
  completionStats: TaskCompletionStat[], 
  monthNames: string[]
): { revenue: FormattedFreelancerRevenue[], activity: FormattedFreelancerActivity[] } {
  
  const last6Months = getLast6Months();
  
  
  const revenueData = last6Months.map(monthKey => {
    const [year, month] = monthKey.split('-');
    const earningEntry = earnings.find((e: FreelancerEarning) => 
      e._id.year === parseInt(year) && 'month' in e._id && e._id.month === parseInt(month)
    );
    
    return {
      month: monthNames[parseInt(month) - 1],
      earnings: earningEntry ? earningEntry.earnings : 0,
      projects: earningEntry ? earningEntry.projects : 0,
      hourly: earningEntry ? earningEntry.hourly : 0,
      fixed: earningEntry ? earningEntry.fixed : 0
    };
  });
  
  const activityData = last6Months.map(monthKey => {
    const [year, month] = monthKey.split('-');
    const bidEntry = bids.find((b: FreelancerBid) => 
      b._id.year === parseInt(year) && 'month' in b._id && b._id.month === parseInt(month)
    );
    const completionEntry = completionStats.find((c: TaskCompletionStat) => 
      c._id.year === parseInt(year) && c._id.month === parseInt(month)
    );
    
    return {
      month: monthNames[parseInt(month) - 1],
      bidsPlaced: bidEntry ? bidEntry.bidsPlaced : 0,
      bidsWon: bidEntry ? bidEntry.bidsWon : 0,
      completion: completionEntry ? completionEntry.completion : 100 
    };
  });
  
  return { revenue: revenueData, activity: activityData };
}

function formatFreelancerQuarterlyData(
  earnings: FreelancerEarning[], 
  bids: FreelancerBid[]
): { revenue: FormattedFreelancerRevenue[], activity: FormattedFreelancerActivity[] } {
  
  const last4Quarters = getLast4Quarters();
  
 
  const revenueData = last4Quarters.map(quarterKey => {
    const [year, quarter] = quarterKey.split('-');
    const earningEntry = earnings.find((e: FreelancerEarning) => 
      e._id.year === parseInt(year) && 'quarter' in e._id && e._id.quarter === parseInt(quarter)
    );
    
    return {
      quarter: `Q${quarter}`,
      earnings: earningEntry ? earningEntry.earnings : 0,
      projects: earningEntry ? earningEntry.projects : 0,
      hourly: earningEntry ? earningEntry.hourly : 0,
      fixed: earningEntry ? earningEntry.fixed : 0
    };
  });
  
  const activityData = last4Quarters.map(quarterKey => {
    const [year, quarter] = quarterKey.split('-');
    const bidEntry = bids.find((b: FreelancerBid) => 
      b._id.year === parseInt(year) && 'quarter' in b._id && b._id.quarter === parseInt(quarter)
    );
    
    return {
      quarter: `Q${quarter}`,
      bidsPlaced: bidEntry ? bidEntry.bidsPlaced : 0,
      bidsWon: bidEntry ? bidEntry.bidsWon : 0,
      completion: 95 
    };
  });
  
  return { revenue: revenueData, activity: activityData };
}

function formatFreelancerYearlyData(
  earnings: FreelancerEarning[], 
  bids: FreelancerBid[]
): { revenue: FormattedFreelancerRevenue[], activity: FormattedFreelancerActivity[] } {
  
  const last3Years = getLast3Years();
  
  
  const revenueData = last3Years.map(year => {
    const earningEntry = earnings.find((e: FreelancerEarning) => e._id.year === parseInt(year));
    
    return {
      year,
      earnings: earningEntry ? earningEntry.earnings : 0,
      projects: earningEntry ? earningEntry.projects : 0,
      hourly: earningEntry ? earningEntry.hourly : 0,
      fixed: earningEntry ? earningEntry.fixed : 0
    };
  });
  
  
  const activityData = last3Years.map(year => {
    const bidEntry = bids.find((b: FreelancerBid) => b._id.year === parseInt(year));
    
    return {
      year,
      bidsPlaced: bidEntry ? bidEntry.bidsPlaced : 0,
      bidsWon: bidEntry ? bidEntry.bidsWon : 0,
      completion: 96 
    };
  });
  
  return { revenue: revenueData, activity: activityData };
}

function formatRatingData(ratings: FreelancerRating[]): FormattedRatingData {
  
  const ratingLabels = ['★☆☆☆☆', '★★☆☆☆', '★★★☆☆', '★★★★☆', '★★★★★'];
  
  
  const formattedRatings: FormattedRatingItem[] = [];
  for (let i = 1; i <= 5; i++) {
    formattedRatings.push({
      rating: i,
      label: ratingLabels[i-1],
      count: 0
    });
  }
  
  ratings.forEach((rating: FreelancerRating) => {
    if (rating._id >= 1 && rating._id <= 5) {
      formattedRatings[rating._id - 1].count = rating.count;
    }
  });
  
  const totalReviews = formattedRatings.reduce((total, item) => total + item.count, 0);
  
  let weightedSum = 0;
  formattedRatings.forEach(rating => {
    weightedSum += rating.rating * rating.count;
  });
  
  const averageRating = totalReviews > 0 ? weightedSum / totalReviews : 0;
  
  return {
    distribution: formattedRatings,
    average: parseFloat(averageRating.toFixed(1)),
    total: totalReviews
  };
}

function formatClientMonthlyData(
  spending: ClientSpending[], 
  requests: ClientRequest[], 
  monthNames: string[]
): { spending: FormattedClientSpending[], activity: FormattedClientActivity[] } { 
  const last6Months = getLast6Months();
  
  const spendingData = last6Months.map(monthKey => {
    const [year, month] = monthKey.split('-');
    const spendingEntry = spending.find((s: ClientSpending) => 
      s._id.year === parseInt(year) && 'month' in s._id && s._id.month === parseInt(month)
    );
    
    return {
      month: monthNames[parseInt(month) - 1],
      spent: spendingEntry ? spendingEntry.spent : 0,
      tasks: spendingEntry ? spendingEntry.tasks : 0,
      ongoing: spendingEntry ? spendingEntry.ongoing : 0,
      completed: spendingEntry ? spendingEntry.completed : 0
    };
  });
  
  const activityData = last6Months.map(monthKey => {
    const [year, month] = monthKey.split('-');
    const requestEntry = requests.find((r: ClientRequest) => 
      r._id.year === parseInt(year) && 'month' in r._id && r._id.month === parseInt(month)
    );
    
    return {
      month: monthNames[parseInt(month) - 1],
      requestsSubmitted: requestEntry ? requestEntry.requestsSubmitted : 0,
      requestsAccepted: requestEntry ? requestEntry.requestsAccepted : 0
    };
  });
  
  return { spending: spendingData, activity: activityData }; 
}

function formatClientQuarterlyData(
  spending: ClientSpending[], 
  requests: ClientRequest[]
): { spending: FormattedClientSpending[], activity: FormattedClientActivity[] } { 
  const last4Quarters = getLast4Quarters();
  
  const spendingData = last4Quarters.map(quarterKey => {
    const [year, quarter] = quarterKey.split('-');
    const spendingEntry = spending.find((s: ClientSpending) => 
      s._id.year === parseInt(year) && 'quarter' in s._id && s._id.quarter === parseInt(quarter)
    );
    
    return {
      quarter: `Q${quarter}`,
      spent: spendingEntry ? spendingEntry.spent : 0,
      tasks: spendingEntry ? spendingEntry.tasks : 0,
      ongoing: spendingEntry ? spendingEntry.ongoing : 0,
      completed: spendingEntry ? spendingEntry.completed : 0
    };
  });
  
  const activityData = last4Quarters.map(quarterKey => {
    const [year, quarter] = quarterKey.split('-');
    const requestEntry = requests.find((r: ClientRequest) => 
      r._id.year === parseInt(year) && 'quarter' in r._id && r._id.quarter === parseInt(quarter)
    );
    
    return {
      quarter: `Q${quarter}`,
      requestsSubmitted: requestEntry ? requestEntry.requestsSubmitted : 0,
      requestsAccepted: requestEntry ? requestEntry.requestsAccepted : 0
    };
  });
  
  return { spending: spendingData, activity: activityData }; 
}

function formatClientYearlyData(
  spending: ClientSpending[], 
  requests: ClientRequest[]
): { spending: FormattedClientSpending[], activity: FormattedClientActivity[] } { 
  const last3Years = getLast3Years();
  
  const spendingData = last3Years.map(year => {
    const spendingEntry = spending.find((s: ClientSpending) => s._id.year === parseInt(year));
    
    return {
      year,
      spent: spendingEntry ? spendingEntry.spent : 0,
      tasks: spendingEntry ? spendingEntry.tasks : 0,
      ongoing: spendingEntry ? spendingEntry.ongoing : 0,
      completed: spendingEntry ? spendingEntry.completed : 0
    };
  });
  
  const activityData = last3Years.map(year => {
    const requestEntry = requests.find((r: ClientRequest) => r._id.year === parseInt(year));
    
    return {
      year,
      requestsSubmitted: requestEntry ? requestEntry.requestsSubmitted : 0,
      requestsAccepted: requestEntry ? requestEntry.requestsAccepted : 0
    };
  });
  
  return { spending: spendingData, activity: activityData }; 
}

function formatTaskStatusData(taskStatusDistribution: TaskStatusDistribution[]): FormattedTaskStatusData {
  
  const statusMapping: Record<string, string> = {
    'draft': 'Draft',
    'open': 'Open',
    'ongoing': 'Ongoing',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  
  const formattedDistribution: FormattedTaskStatus[] = [];
  let total = 0;
  
  taskStatusDistribution.forEach(item => {
    total += item.count;
  });
  
  taskStatusDistribution.forEach(item => {
    formattedDistribution.push({
      status: statusMapping[item._id] || item._id,
      count: item.count,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
    });
  });
  
  return {
    distribution: formattedDistribution,
    total
  };
}

function getLast6Months(): string[] {
  const result: string[] = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(currentDate.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    result.unshift(`${year}-${month}`);
  }
  
  return result;
}

function getLast4Quarters(): string[] {
  const result: string[] = [];
  const currentDate = new Date();
  const currentQuarter = Math.ceil((currentDate.getMonth() + 1) / 3);
  
  for (let i = 0; i < 4; i++) {
    const date = new Date();
    date.setMonth(currentDate.getMonth() - (i * 3));
    const year = date.getFullYear();
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    result.unshift(`${year}-${quarter}`);
  }
  
  return result;
}

function getLast3Years(): string[] {
  const result: string[] = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < 3; i++) {
    result.unshift((currentYear - i).toString());
  }
  
  return result;
}