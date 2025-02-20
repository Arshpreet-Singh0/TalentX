import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';

import userRouter from "./routes/user.routes";
import projectRouter from "./routes/project.routes";
import commentRouter from "./routes/comment.routes";
import { isAuthenticated } from './middlewares/isAuthenticated';
import prisma from "./config/prisma"

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://ec2-54-90-122-141.compute-1.amazonaws.com:3000"],
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
app.use('/api/v1/comment', commentRouter);

app.get("/recent-chats", isAuthenticated, async (req: Request, res: Response, next : NextFunction) => {
  try {
    const userId = Number(req.userId);

    // Fetch the latest message per user
    const latestMessages = await prisma.chat.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { timestamp: "desc" }, // Sort by newest messages first
      distinct: ["senderId", "receiverId"], // Ensure only one message per user
      select: {
        senderId: true,
        receiverId: true,
        message: true,
        timestamp: true,
      },
    });

    // Extract unique user IDs and messages
    const recentChatsMap = new Map<number, { message: string; createdAt: Date }>();

    for (const chat of latestMessages) {
      const chatUserId = chat.senderId === userId ? chat.receiverId : chat.senderId;
      
      // Only add if not already present (ensures one entry per user)
      if (!recentChatsMap.has(chatUserId)) {
        recentChatsMap.set(chatUserId, { message: chat.message, createdAt: chat.timestamp });
      }
    }

    // Fetch user details
    const users = await prisma.user.findMany({
      where: { id: { in: Array.from(recentChatsMap.keys()) } },
      select: { id: true, name: true },
    });

    // Combine user details with their last message
    const recentChats = users.map(user => ({
      id: user.id,
      name: user.name,
      lastMessage: recentChatsMap.get(user.id)?.message || null,
      lastMessageAt: recentChatsMap.get(user.id)?.createdAt || null,
    }));

    res.status(200).json({ recentChats });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get('/messages/:senderId', isAuthenticated, async (req, res, next : NextFunction) => {
  try {
    const userId = Number(req.userId);
    const senderId = Number(req.params.senderId);

    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: senderId },
          { senderId: senderId, receiverId: userId }
        ]
      },
      orderBy: {
        timestamp : 'asc' // Sort messages in chronological order
      },
      take : 50
    });

    res.json({ chats });
  } catch (error) {
    console.error("Error fetching messages:", error);
    next(error);
  }
});

app.post("/send-message/:id", isAuthenticated, async(req, res, next : NextFunction)=>{
  try {
    const userId = Number(req.userId);
    const {message} = req.body;

    await prisma.chat.create({
      data : {
        senderId : userId,
        receiverId : Number(req.params.id),
        message : message
      }
    });

    res.status(200).json({
      message : "Message Sent successfully",
      success : true,
    });


  } catch (error) {
    console.log(error);
    next(error);
  }
});  

app.get('/search', async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
  try {
    const { query } = req.query; // Get the search query from the request

    if (!query) {
      res.status(400).json({ message: "Search query is required" });
      return;
    }

    // Search Users by matching skills
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {skills: {
            hasSome: [query as string], // Matches users who have the query in their skills array
          }},
          {
            name : {
              contains : query as string,
            }
          },
          {
            username : {
              contains : query as string
            }
          }
        ]
        
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        skills: true,
      },
    });

    // Search Projects by matching title, description, or skills
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: query as string, mode: "insensitive" } },
          { description: { contains : query as string, mode: "insensitive" } },
          { skills: { hasSome: [query as string] } }, // Matches projects with the query in skills
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        githuburl: true,
        liveurl: true,
        skills: true,
        likeCount: true,
        images: true,
        User: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.status(200).json({ users, projects });
    
  } catch (error) {
    console.error("Search Error:", error);
    next(error);
  }
});
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