import { JwtService } from "../infrastructure/services/JwtService";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { comparePassword } from "../infrastructure/services/HashPassword";
import { AccountDetailRepository } from "../infrastructure/repositories/accountDetail";
import { FreelancerProfileRepository } from "../infrastructure/repositories/FreelancerProfileRepository";
import { TaskRepository } from "../infrastructure/repositories/TaskRepository";
import { ContractRepository } from "../infrastructure/repositories/contractRepository";


  
  interface RevenueData {
    month: string;
    revenue: number;
    commission: number;
    projects: number;
  }
  
  interface UserGrowthData {
    month: string;
    clients: number;
    freelancers: number;
  }
  
  interface CategoryData {
    name: string;
    value: number;
  }


export const adminUseCase = {
    login: async (email: string, password: string ) => {
        const admin = await UserRepository.findUserByEmail(email);
        if(!admin || admin.role !== 'admin'){
            throw {message:'Admin not found or access denied'};
        }
        const isValidPassword = await comparePassword(password, admin.password);
        if(!isValidPassword){
            throw {message:'Invalid credentials'};
        }

        const token = JwtService.generateToken({id: admin.id, email: admin.email, role: admin.role});
        return {token, admin};
    },
    getAllUsers: async({filters,skip,limit}:{filters:any,skip:number, limit: number}) => {
        return await UserRepository.findUserByRole(filters,skip,limit);
    },
    getUsersCount: async(filters:any) => {
        return await UserRepository.findUserCount(filters)
    },
    toggleBlockUser: async (userId: string, isBlocked: boolean) => {
        const updatedUser = await UserRepository.toggleBlockUser(userId, isBlocked);
       
        return updatedUser;
    },
    getDashboardStats: async() => {
        const totalUsers = await UserRepository.totalUsersCount();
        const activeClients = await AccountDetailRepository.activeClientsCount();
        const activeFreelancers = await FreelancerProfileRepository.activeFreelancersCount();
        const totalProjects = await TaskRepository.totalProjectsCount();
        const ongoingProjects = await TaskRepository.ongoingProjectsCount();
        const completedProjects = await TaskRepository.completedProjectsCount();
      
        const contracts = await ContractRepository.completedMilestones();
      
        let totalRevenue = 0;
        let platformCommission = 0;
      
        contracts.forEach(contract => {
          contract.milestones.forEach(milestone => {
            if (milestone.status === 'completed' && milestone.paymentDetails) {
              // Convert string to number first, then add to total
              totalRevenue += parseFloat(milestone.paymentDetails.amount) || 0;
              platformCommission += parseFloat(milestone.paymentDetails.platformFee) || 0;
            }
          });
        });
      
        const currentDate = new Date();
        const sevenMonthsAgo = new Date();
        sevenMonthsAgo.setMonth(currentDate.getMonth() - 6);
        const monthlyRevenueAgg = await ContractRepository.monthlyRevenueAgg(sevenMonthsAgo, currentDate);
      
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueData: RevenueData[] = monthlyRevenueAgg.map(item => ({
          month: monthNames[item._id.month - 1],
          revenue: parseFloat(item.revenue.toFixed(2)),
          commission: parseFloat(item.commission.toFixed(2)),
          projects: item.count
        }));
      
        const userGrowthAgg = await UserRepository.userGrowthAgg(sevenMonthsAgo, currentDate);
      
        const userGrowthData: UserGrowthData[] = [];
      
        // Initialize with all months
        for (let i = 0; i < 7; i++) {
          const date = new Date(sevenMonthsAgo);
          date.setMonth(sevenMonthsAgo.getMonth() + i);
          userGrowthData.push({
            month: monthNames[date.getMonth()],
            clients: 0,
            freelancers: 0
          });
        }
      
        // Fill in actual data
        userGrowthAgg.forEach(item => {
          const monthIndex = item._id.month - sevenMonthsAgo.getMonth() - 1;
          if (monthIndex >= 0 && monthIndex < userGrowthData.length) {
            if (item._id.role === 'client') {
              userGrowthData[monthIndex].clients = item.count;
            } else if (item._id.role === 'freelancer') {
              userGrowthData[monthIndex].freelancers = item.count;
            }
          }
        });
      
        // Calculate cumulative totals for each month
        let clientsRunningTotal = 0;
        let freelancersRunningTotal = 0;
      
        userGrowthData.forEach((data, index) => {
          clientsRunningTotal += data.clients;
          freelancersRunningTotal += data.freelancers;
          userGrowthData[index].clients = clientsRunningTotal;
          userGrowthData[index].freelancers = freelancersRunningTotal;
        });
      
        const categoryAgg = await TaskRepository.categoryAgg();
      
        const totalCategoryCounts = categoryAgg.reduce((acc, curr) => acc + curr.count, 0);
        const categoryData: CategoryData[] = categoryAgg.map(item => ({
          name: item._id,
          value: Math.round((item.count / totalCategoryCounts) * 100)
        }));
      
        const recentTransactions = await ContractRepository.recentTransactions();   
        const pendingVerificationUsers = await UserRepository.pendingVerificationUsers();
      
        const recentProjects = await TaskRepository.recentProjects();
        
        return {
          stats:{totalUsers,
            activeClients,
            activeFreelancers,
            totalProjects,
            ongoingProjects,
            completedProjects,
            totalRevenue,
            platformCommission,
          },
          revenueData,
          userGrowthData,
          categoryData,
          recentTransactions,
          pendingVerifications:pendingVerificationUsers,
          recentProjects
        };
      }
}