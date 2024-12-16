import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; 
import { Config } from './config/config';
import { catchError } from './interfaces/middlewares/catchError';
import userRouter from './interfaces/routes/UserRoutes';
import adminRouter from './interfaces/routes/adminRoutes';
import freelancerRouter from './interfaces/routes/freelancerRouter';
import clientRouter from './interfaces/routes/clientRouter';


const port = Config.PORT ;
const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}))


app.use('/api/users',userRouter);
app.use('/api/admin',adminRouter);
app.use('/api/freelancers',freelancerRouter);
app.use('/api/client/',clientRouter);

app.use(catchError);

mongoose 
.connect(Config.DB_URI as string)
.then(()=>{
    console.log('connected to MongoDB');
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
        
    });
}).catch((error)=>{
    console.log('Failed to connect to MongoDB', error);
    
})