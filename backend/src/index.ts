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
import { ICallSignal } from './entities/CallSignal';
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

 app.use('/api/client/webhook', express.raw({ type: 'application/json' }));
 app.use(express.json());
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

//----------------video Call ------------------//

io.on('connection', (socket) => {
  socket.emit('me', socket.id);

  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('callUser', {
      signal: data.signalData,
      from: data.from,
      name: data.name
    });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });

  socket.on('endCall', (data) => {
    io.to(data.to).emit('callEnded');
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('callEnded');
  });
});

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
export const sendNotification = (userId: any , notification: any) => {
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
            createdAt:new Date(),
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

      // Add these handlers to your socket.io implementation in your server file
// This should go inside your existing io.on('connection') block in your server.js/ts file

// Video call events
// Video call events
socket.on('call_initiated', async (data) => {
  const { roomID, callerId, callerName, receiverId, role } = data;
  console.log(`Call initiated from ${callerId} to ${receiverId} in room ${roomID}`);
  
  // Adjust the caller ID based on role, similar to messaging
  let adjustedCallerId: string | null = callerId;
  if (role === 'freelancer') {
    const freelancerProfile = await FreelancerProfileRepository.getFreelancerByUserId(callerId);
    adjustedCallerId = freelancerProfile ? freelancerProfile._id.toString() : null;
  } else if (role === 'client') {
    const accountDetail = await AccountDetailRepository.findUserDetailsById(callerId);
    adjustedCallerId = accountDetail ? accountDetail._id.toString() : null;
  }

  if (!adjustedCallerId) {
    console.error('Caller ID could not be determined.');
    return;
  }
  
  // Get receiver's socket ID from your map
  const receiverSocketId = socketConnection.get(receiverId);
  
  if (receiverSocketId) {
    console.log(`Sending incoming call notification to ${receiverId}`);
    io.to(receiverSocketId).emit('incoming_call', {
      roomID,
      callerId: adjustedCallerId, // Send the adjusted ID
      callerName: callerName || 'Someone' // Default if name not provided
    });
  } else {
    console.log(`Receiver ${receiverId} is not connected`);
    // Optionally inform caller that receiver is not available
    io.to(socket.id).emit('call_failed', {
      reason: 'User is offline'
    });
  }
});

socket.on('call_accepted', async (data) => {
  const { roomID, callerId, accepterId, role } = data;
  console.log(`Call accepted by ${accepterId} for caller ${callerId} in room ${roomID}`);
  
  // Adjust the accepter ID based on role if needed
  let adjustedAccepterId: string | null = accepterId;
  if (role === 'freelancer') {
    const freelancerProfile = await FreelancerProfileRepository.getFreelancerByUserId(accepterId);
    adjustedAccepterId = freelancerProfile ? freelancerProfile._id.toString() : null;
  } else if (role === 'client') {
    const accountDetail = await AccountDetailRepository.findUserDetailsById(accepterId);
    adjustedAccepterId = accountDetail ? accountDetail._id.toString() : null;
  }

  if (!adjustedAccepterId) {
    console.error('Accepter ID could not be determined.');
    return;
  }
  
  // Get caller's socket ID
  const callerSocketId = socketConnection.get(callerId);
  
  if (callerSocketId) {
    io.to(callerSocketId).emit('call_accepted', {
      roomID,
      accepterId: adjustedAccepterId
    });
  }
});

socket.on('call_rejected', (data) => {
  const { callerId } = data;
  console.log(`Call rejected for caller ${callerId}`);
  
  // Get caller's socket ID
  const callerSocketId = socketConnection.get(callerId);
  
  if (callerSocketId) {
    io.to(callerSocketId).emit('call_rejected', {
      message: 'Call was rejected'
    });
  }
});

socket.on('call_started', (data) => {
  // You can use this to track active calls if needed
  console.log(`Call started in room ${data.roomID}`);
});

socket.on('call_ended', (data) => {
  const { roomID, userId } = data;
  console.log(`Call ended in room ${roomID} by user ${userId}`);
  
  // Broadcast to all users in the room that the call has ended
  socket.to(roomID).emit('call_ended', {
    endedBy: userId
  });
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