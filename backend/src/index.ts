import express from 'express';
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
import { IMessage } from './entities/Message';

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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization','refreshToken'],
  }));

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}))


app.use('/api/users',userRouter);
app.use('/api/admin',adminRouter);
app.use('/api/freelancers',freelancerRouter);
app.use('/api/client/',clientRouter);

app.use(catchError);
const socketConnection = new Map<string, string>();


io.on('connection',(socket) => {
  const userId = socket.handshake.query.userId as string;
  const role = socket.handshake.query.role as string;
    console.log(`User connected with ID: ${userId}`);
  socketConnection.set(userId, socket.id);
    socket.on('get_messages', async ({ senderId, receiverId }) => {
        try {
          const chat = await ChatModel.findOne({
            participants: { $all: [senderId, receiverId] },
          }).populate({
            path: 'messages',
            model: 'Message',
            populate: {
              path: 'senderId receiverId',
              model: 'User',
            },
          });
    
          if (!chat) {
            socket.emit('message_history', []);
            return;
          }
    
          const messages =  (chat.messages as unknown as IMessage[]).map((msg)  => ({
            senderId: msg.senderId._id,
            receiverId: msg.receiverId._id,
            text: msg.text,
            type: msg.type,
            time: msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Unknown Time',
          }));
    
          socket.emit('message_history', messages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      });

      socket.on('send_message', async (data) => {
        try {
          const { senderId, receiverId, text, type, time } = data;
          console.log('dd',data)
          let socketId = socketConnection.get(receiverId) as string
          
          let receiveId = socketConnection.get(senderId) as string
          console.log('rrss',socketId,receiveId)
          let chat = await ChatModel.findOne({
            participants: { $all: [senderId, receiverId] },
          });
    
          if (!chat) {
            chat = new ChatModel({
              participants: [senderId, receiverId],
              messages: [],
            });
            await chat.save();
          }
          const message = new MessageModel({
            senderId,
            receiverId,
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

      socket.on('create_chat_room', async (data) => {
        try {
          const { senderId, receiverId } = data;
          let chat = await ChatModel.findOne({
            participants: { $all: [senderId, receiverId] },
          });
      
          if (!chat) {
            chat = new ChatModel({
              participants: [senderId, receiverId],
              messages: [], 
            });
            await chat.save();
          }
          
          io.to(senderId).emit('chat_created', chat);
          io.to(receiverId).emit('chat_created', chat);
      
        } catch (err) {
          console.error("Error creating chat room: ", err);
        }
      });
      

    socket.on('disconnect',() => {
        console.log('A user disconnected:', socket.id);        
    })    
})

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