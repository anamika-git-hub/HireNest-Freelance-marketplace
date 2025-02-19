import express, { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; 
import { Config } from './config/config';
import { catchError } from './interfaces/middlewares/catchError';
import userRouter from './interfaces/routes/UserRoutes';
import adminRouter from './interfaces/routes/adminRoutes';
import freelancerRouter from './interfaces/routes/freelancerRouter';
import clientRouter from './interfaces/routes/clientRouter';
import { Server } from 'socket.io';
import http from 'http';
import { MessageModel } from './infrastructure/models/MessageModel';
import { ChatModel } from './infrastructure/models/ChatModel';
import { FreelancerProfileRepository } from './infrastructure/repositories/FreelancerProfileRepository';
import { AccountDetailRepository } from './infrastructure/repositories/accountDetail';
import { IMessage } from './entities/Message';
import Stripe from 'stripe';

export const stripe = new Stripe(Config.STRIPE_SECRET_KEY as string, {
  apiVersion:'2025-01-27.acacia'
})

const port = Config.PORT ;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000'], 
      methods: ['GET', 'POST'],
    },
    allowEIO3: true,
  });

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization','refreshToken'],
  }));

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}))


app.use('/api/users',userRouter);
app.use('/api/admin',adminRouter);
app.use('/api/freelancers',freelancerRouter);
app.use('/api/client/',clientRouter);

app.use(catchError);

//---------------Notification ----------------//
const notificationIo = io.of('/notifications'); 

const notificationConnections = new Map<string, string>();

notificationIo.on('connection', async (socket) => {
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    notificationConnections.set(userId, socket.id);
    console.log('connected')
  }

  socket.on('disconnect', () => {
    notificationConnections.delete(userId);
    console.log('disconnected')
  });
});

// Function to send notifications
export const sendNotification = (userId: string, notification: any) => {
  const socketId = notificationConnections.get(userId);
  if (socketId) {
    notificationIo.to(socketId).emit('new_notification', notification);
  }
};

//------------------Chat----------------///

const socketConnection = new Map<string, string>();

io.on('connection',async(socket) => {
  const userId = socket.handshake.query.userId as string;
  const role = socket.handshake.query.role as string;
    let uniqueId: string | null = null;
    if(role === 'freelancer'){
      const freelancerProfile = await FreelancerProfileRepository.getFreelancerByUserId(userId);
      uniqueId = freelancerProfile ? freelancerProfile._id.toString() : null;
    }else if( role === 'client'){
      const accountDetail = await AccountDetailRepository.findUserDetailsById(userId);
      uniqueId = accountDetail ? accountDetail._id.toString() : null;
    }
    if (uniqueId) {
      socketConnection.set(uniqueId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    }

    //----------------get message-----------------------------//
    socket.on('get_messages', async ({ senderId, receiverId, role }) => {
        try {
          if(role === 'freelancer'){
            const freelancerProfile = await FreelancerProfileRepository.getFreelancerByUserId(senderId);
            senderId = freelancerProfile ? freelancerProfile._id.toString() : null;
          }else if( role === 'client'){
            const accountDetail = await AccountDetailRepository.findUserDetailsById(senderId);
            senderId = accountDetail ? accountDetail._id.toString() : null;
          }
          const chat = await ChatModel.findOne({
            participants: { $all: [senderId, receiverId] },
          }).populate({
            path: 'messages',
            model: 'Message',
          });
    
          if (!chat) {
            socket.emit('message_history', []);
            return;
          }
          const messages =  (chat.messages as unknown as IMessage[]).map((msg)  => ({
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            text: msg.text,
            type: msg.type,
            time: msg.createdAt,
            isRead: msg.isRead
          }));
          socket.emit('message_history', messages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      });
     //-----------------------clear chat------------------------//

      socket.on('clear_chat', async ({ senderId, receiverId, role }) => {
        try {
          if (role === 'freelancer') {
            const freelancerProfile = await FreelancerProfileRepository.getFreelancerByUserId(senderId);
            senderId = freelancerProfile ? freelancerProfile._id.toString() : null;
          } else if (role === 'client') {
            const accountDetail = await AccountDetailRepository.findUserDetailsById(senderId);
            senderId = accountDetail ? accountDetail._id.toString() : null;
          }
      
          const chat = await ChatModel.findOne({
            participants: { $all: [senderId, receiverId] }
          });
      
          if (chat) {
            chat.messages = []; 
            await chat.save();  
          }
      
          socket.emit('chat_cleared', receiverId);
        } catch (error) {
          console.error('Error clearing chat:', error);
        }
      });
      
      //--------------mark message read ---------------------------//
       
      socket.on('mark_messages_read', async (data) => {
        try {
          const { senderId, receiverId, role } = data;
          
          let adjustedSenderId: string | null = senderId;
          
          if (role === 'freelancer') {
            const freelancerProfile = await FreelancerProfileRepository.getFreelancerByUserId(senderId);
            adjustedSenderId = freelancerProfile ? freelancerProfile._id.toString() : null;
          } else if (role === 'client') {
            const accountDetail = await AccountDetailRepository.findUserDetailsById(senderId);
            adjustedSenderId = accountDetail ? accountDetail._id.toString() : null;
          }
      
          if (!adjustedSenderId) {
            console.error('Sender ID could not be determined.');
            return;
          }
      
          const chat = await ChatModel.findOne({
            participants: { $all: [adjustedSenderId, receiverId] },
          });
      
          if (chat) {
            await MessageModel.updateMany(
              {
                _id: { $in: chat.messages },
                receiverId: adjustedSenderId,
                isRead: false
              },
              {
                $set: { isRead: true }
              }
            );
      
            const socketId = socketConnection.get(receiverId);
            const receiveId = socketConnection.get(adjustedSenderId);
      
            if (socketId) {
              io.to(socketId).emit('messages_marked_read', {
                chatId: chat._id,
                readBy: adjustedSenderId
              });
            }
            if (receiveId) {
              io.to(receiveId).emit('messages_marked_read', {
                chatId: chat._id,
                readBy: adjustedSenderId
              });
            }
          }
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      });

      //------------------------send message----------------------------//

      socket.on('send_message', async (data) => {
        try {
          const { senderId, receiverId,role, text, type, time } = data;
        
          let adjustedSenderId: string | null = senderId;
          let senderRef,receiverRef
          if (role === 'freelancer') {
            const freelancerProfile = await FreelancerProfileRepository.getFreelancerByUserId(senderId);
            adjustedSenderId = freelancerProfile ? freelancerProfile._id.toString() : null;
          } else if (role === 'client') {
            const accountDetail = await AccountDetailRepository.findUserDetailsById(senderId);
            adjustedSenderId = accountDetail ? accountDetail._id.toString() : null;
          }
      
          if (!adjustedSenderId) {
            console.error('Sender or receiver ID could not be determined.');
            return;
          }

          let socketId = socketConnection.get(receiverId) as string
          let receiveId = socketConnection.get(adjustedSenderId) as string

          let chat = await ChatModel.findOne({
            participants: { $all: [adjustedSenderId, receiverId] },
          });
    
          if (!chat) {
            chat = new ChatModel({
              participants: [adjustedSenderId, receiverId],
              messages: [],
            });
            await chat.save();
          }
          const message = new MessageModel({
            userId:senderId,
            senderId:adjustedSenderId,
            receiverId,
            senderRef:senderRef,
            receiverRef:receiverRef,
            text,
            type,
            time,
            isRead: false, 
          });
          await message.save();
     
          chat.messages.push(message._id);
          await chat.save();
          io.to(socketId).emit('receive_message', message);
          io.to(receiveId).emit('receive_message', message);
    
        } catch (error) {
          console.error('Error sending message:', error);
        }
      });

    socket.on('disconnect',() => {
        console.log('A user disconnected:', socket.id);        
    })    
})

const errorHandler:ErrorRequestHandler =(err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).json({ message: err.message || 'Internal Server Error' });
};

app.use(errorHandler)


mongoose 
.connect(Config.DB_URI as string)
.then(()=>{
    console.log('connected to MongoDB');
    server.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
        
    });
}).catch((error)=>{
    console.log('Failed to connect to MongoDB', error);
    
})