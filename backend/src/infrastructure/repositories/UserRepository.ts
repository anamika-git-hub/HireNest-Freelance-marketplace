import { UserModel } from "../models/UserModel";
import { Iuser } from "../../entities/User";
import { FilterCriteria } from "../../entities/filter";

export const UserRepository = {

    findUserByEmail: async (email: string) => UserModel.findOne({ email }),
    findUserById: async (id: string) => UserModel.findById(id),
    findUserByRole: async (filters:FilterCriteria,skip:number, limit:number)  =>  {
        const result = await UserModel.find({...filters
        }).skip(skip).limit(limit);
        return result
    },
    findUserCount: async (filters: FilterCriteria) => {
        return await UserModel.countDocuments({
            ...filters,
        });
    },
    
    createUser: async (userData: Iuser) => new UserModel(userData).save(),
    updateUser: async (id: string, updates: Iuser) => UserModel.findByIdAndUpdate(id, updates, {new: true}),
    updateUserVerification: async (email: string, isVerified: boolean) => {
        return UserModel.findOneAndUpdate(
            {email},
            {isVerified},
            {new: true}
        );
    },
    toggleBlockUser: async (userId: string, isBlocked: boolean) => {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isBlocked: !isBlocked},
            {new: true}
        );
        return updatedUser;
    },
    updateRole: async (role: string, userId:string) => {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { role },
            { new: true } 
          );
          return updatedUser
    },
    updatePassword: async (userId:string,password:string) => {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { password },
            { new: true } 
          );
          return updatedUser
    },

    totalUsersCount: async() => {
        const totalUsers = await UserModel.countDocuments();
        return totalUsers;
    },

    userGrowthAgg: async(sevenMonthsAgo: Date, currentDate: Date) => {
        return await UserModel.aggregate([
            {
              $match: {
                createdAt: { $gte: sevenMonthsAgo, $lte: currentDate },
                isVerified: true
              }
            },
            {
              $project: {
                month: { $month: '$createdAt' },
                year: { $year: '$createdAt' },
                role: 1
              }
            },
            {
              $group: {
                _id: { month: '$month', year: '$year', role: '$role' },
                count: { $sum: 1 }
              }
            },
            {
              $sort: { '_id.year': 1, '_id.month': 1 }
            }
          ]);
    },

    pendingVerificationUsers: async() => {
        return await UserModel.aggregate([
            {
              $match: { isVerified: false }
            },
            {
              $sort: { createdAt: -1 }
            },
            {
              $limit: 3
            },
            {
              $lookup: {
                from: 'userdetails',
                localField: '_id',
                foreignField: 'userId',
                as: 'userDetails'
              }
            },
            {
              $project: {
                id: { $toString: '$_id' },
                name: { 
                  $concat: [
                    { $arrayElemAt: ['$userDetails.firstname', 0] }, 
                    ' ', 
                    { $arrayElemAt: ['$userDetails.lastname', 0] }
                  ] 
                },
                type: '$role',
                submittedDate: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
              }
            }
          ]);
    }

};
