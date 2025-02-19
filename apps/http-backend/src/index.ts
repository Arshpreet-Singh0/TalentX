import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';

import userRouter from "./routes/user.routes";
import projectRouter from "./routes/project.routes";
import commentRouter from "./routes/comment.routes";

const app = express();

app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

//api's

app.use('/api/v1', userRouter);
app.use('/api/v1/project', projectRouter);
app.use('/api/v1/commet', commentRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
  });
  

app.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}`);
    
})