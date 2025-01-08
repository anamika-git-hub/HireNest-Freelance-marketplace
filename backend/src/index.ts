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

io.on('connection',(socket) => {
    console.log('A user connected:', socket.id);

    socket.on('get_messages', async ({ senderId, receiverId }) => {
        try {
          const messages = await MessageModel.find({
            $or: [
              { senderId, receiverId },
              { senderId: senderId, receiverId: receiverId },
            ],
          }).sort({ createdAt: 1 });
          socket.emit('message_history', messages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      });

      socket.on('send_message', async (data) => {
        console.log('dddddddddddddddddddddddd',data);
        
        try {
          const message = new MessageModel(data);
          await message.save();
          io.emit('receive_message', message);
        } catch (error) {
          console.error('Error saving message:', error);
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