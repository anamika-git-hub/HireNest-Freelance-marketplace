import { TaskSubmissionModel } from "../models/TaskSubmissionModel";
import { ITaskSubmissionForm } from "../../entities/Tasks";
import { FilterCriteria } from "../../entities/filter";
import { BidSubmissionModel } from "../models/BidSubmissionModel";
import mongoose from "mongoose";

export const TaskRepository = {
    // Create a new task submission
    createTask: async (data: ITaskSubmissionForm) => {
        try {
            const task = new TaskSubmissionModel(data);
            return await task.save();
        }catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to create Task: ${error.message}`);
            }else {
                throw new Error(`Failed to create Task due to an unknown error`);
            } 
        }
    },

    // Update an existing task submission
    updateTask: async (id: string, updates: Partial<ITaskSubmissionForm>) => {
        try {
            const updatedTask = await TaskSubmissionModel.findByIdAndUpdate(id, updates, { new: true });
            if (!updatedTask) {
                throw new Error("Task not found");
            }
            return updatedTask;
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to update Task: ${error.message}`);
            }else {
                throw new Error(`Failed to update Task due to an unknown error`);
            } 
        }
    },

    // Delete a task submission
    deleteTask: async (id: string) => {
        try {
            const deletedTask = await TaskSubmissionModel.findByIdAndDelete(id);
            if (!deletedTask) {
                throw new Error("Task not found");
            }
            return deletedTask;
        }catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to delete Task: ${error.message}`);
            }else {
                throw new Error(`Failed to delete Task due to an unknown error`);
            } 
        }
    },

    getTasks: async (filters:FilterCriteria,sortCriteria:{ [key: string]: 1 | -1 },skip:number,limit:number) => {
        const currentDate = new Date().toISOString();
        const result = await TaskSubmissionModel.find({
            ...filters,
            timeline: { $gt: currentDate }, 
        }).sort(sortCriteria).skip(skip).limit(limit);
        return result
     },
    getTaskCount: async(filters:FilterCriteria) => {
        try {
            const currentDate = new Date().toISOString(); 
            return await TaskSubmissionModel.countDocuments({
                ...filters,
                timeline: { $gt: currentDate }, 
            });
        }catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to count Task : ${error.message}`);
            }else {
                throw new Error(`Failed to count Task due to an unknown error`);
            } 
        }
    } ,
    getTaskById: async (id: string) => {
        try {
            const task = await TaskSubmissionModel.findById(id);
            if (!task) {
                throw new Error("Task not found");
            }
            return task;
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to get Task by Id: ${error.message}`);
            }else {
                throw new Error(`Failed to get Task by Id due to an unknown error`);
            } 
        }
    },

    getTaskByUserId: async (id:string) => {
        try {
            const task = await TaskSubmissionModel.find({clientId:id});
            if(!task) throw new Error("Task not found");
            return task;
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to get Task by userId: ${error.message}`);
            }else {
                throw new Error(`Failed to get Task by userId due to an unknown error`);
            } 
        }
    },

    updateTaskStatus: async (id:string,status: string) => {
        try {
            return await TaskSubmissionModel.findByIdAndUpdate(id,{ status: status }, { new: true })
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to get Task by userId: ${error.message}`);
            }else {
                throw new Error(`Failed to get Task by userId due to an unknown error`);
            }   
        }
    },

    totalProjectsCount: async() => {
        return await TaskSubmissionModel.countDocuments();
    },
    ongoingProjectsCount: async() => {
        return await TaskSubmissionModel.countDocuments({
            status: 'ongoing'
        })
    },
    completedProjectsCount: async() => {
        return await TaskSubmissionModel.countDocuments({
            status: 'completed'
        })
    },

    categoryAgg:async() => {
       return await TaskSubmissionModel.aggregate([
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 }
              }
            },
            {
              $sort: { count: -1 }
            },
            {
              $limit: 5
            }
          ]);
    },
    recentProjects: async() => {
        return await TaskSubmissionModel.aggregate([
            {
              $sort: { createdAt: -1 }
            },
            {
              $limit: 3
            },
            {
              $lookup: {
                from: 'userdetails',
                localField: 'clientId',
                foreignField: 'userId',
                as: 'clientDetails'
              }
            },
            {
              $project: {
                id: { $toString: '$_id' },
                name: '$projectName',
                client: { 
                  $concat: [
                    { $arrayElemAt: ['$clientDetails.firstname', 0] }, 
                    ' ', 
                    { $arrayElemAt: ['$clientDetails.lastname', 0] }
                  ] 
                },
                budget: { $toString: { $avg: ['$minRate', '$maxRate'] } },
                status: '$status'
              }
            }
          ]);
    },

    getClientProposalStats:async(clientId:string, startDate:Date, endDate:Date) => {
        const ObjectId = mongoose.Types.ObjectId;
    
    const clientTasks = await TaskSubmissionModel.find({
      clientId: new ObjectId(clientId),
      createdAt: { $gte: startDate, $lte: endDate }
    }).select('_id');
    
    const taskIds = clientTasks.map(task => task._id);
    
    const monthlyProposals = await BidSubmissionModel.aggregate([
      {
        $match: {
          taskId: { $in: taskIds }
        }
      },
      {
        $lookup: {
          from: "tasksubmissions",
          localField: "taskId",
          foreignField: "_id",
          as: "task"
        }
      },
      {
        $unwind: "$task"
      },
      {
        $group: {
          _id: {
            year: { $year: "$task.createdAt" },
            month: { $month: "$task.createdAt" }
          },
          proposals: { $sum: 1 },
          shortlisted: {
            $sum: {
              $cond: [
                { $eq: ["$status", "accepted"] },
                1,
                0
              ]
            }
          },
          hired: {
            $sum: {
              $cond: [
                { $eq: ["$status", "accepted"] },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    const quarterlyProposals = await BidSubmissionModel.aggregate([
      {
        $match: {
          taskId: { $in: taskIds }
        }
      },
      {
        $lookup: {
          from: "tasksubmissions",
          localField: "taskId",
          foreignField: "_id",
          as: "task"
        }
      },
      {
        $unwind: "$task"
      },
      {
        $group: {
          _id: {
            year: { $year: "$task.createdAt" },
            quarter: { 
              $ceil: { $divide: [{ $month: "$task.createdAt" }, 3] }
            }
          },
          proposals: { $sum: 1 },
          shortlisted: {
            $sum: {
              $cond: [
                { $eq: ["$status", "accepted"] },
                1,
                0
              ]
            }
          },
          hired: {
            $sum: {
              $cond: [
                { $eq: ["$status", "accepted"] },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.quarter": 1 } }
    ]);
    
    const yearlyProposals = await BidSubmissionModel.aggregate([
      {
        $match: {
          taskId: { $in: taskIds }
        }
      },
      {
        $lookup: {
          from: "tasksubmissions",
          localField: "taskId",
          foreignField: "_id",
          as: "task"
        }
      },
      {
        $unwind: "$task"
      },
      {
        $group: {
          _id: {
            year: { $year: "$task.createdAt" }
          },
          proposals: { $sum: 1 },
          shortlisted: {
            $sum: {
              $cond: [
                { $eq: ["$status", "accepted"] },
                1,
                0
              ]
            }
          },
          hired: {
            $sum: {
              $cond: [
                { $eq: ["$status", "accepted"] },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { "_id.year": 1 } }
    ]);
    
    return { monthlyProposals, quarterlyProposals, yearlyProposals };
    }

};
