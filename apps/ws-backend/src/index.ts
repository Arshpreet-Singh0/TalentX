import WebSocket, { WebSocketServer } from "ws";
import dotenv from "dotenv";
dotenv.config();
import JWT_SECRET from "./config/config";
import jwt from "jsonwebtoken";
import {prisma} from "@repo/db/client"


const wss = new WebSocketServer({port : 3001});

const connection = new Map<String , WebSocket>();

wss.on("connection", (ws, req)=>{
    const url = req.url;
    if (!url) {
      return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    
    const userId = checkUser(token);
    console.log(userId);
    
  
    if (userId == null) {
      ws.close()
      return null;
    }

    connection.set(userId, ws);
    console.log(userId);
    

    ws.on("message", async(data)=>{
        const parsedData = JSON.parse(data as unknown as string);
        console.log(parsedData);
        

        if(parsedData.type==="chat"){
            const receiverId = parsedData.receiverId.toString();

            try {
              await prisma.chat.create({
                data : {
                  message : parsedData.message,
                  senderId : Number(userId),
                  receiverId : Number(receiverId)
                }
              });

              console.log(connection.has(receiverId));
              
  
              if(connection.has(receiverId)){
                  const socket = connection.get(receiverId);
                  socket?.send(JSON.stringify({
                      message : parsedData.message,
                      senderId : userId,
                      receiverId : receiverId,
                  }));
                }
            } catch (error) {
              console.log(error);
              return;
              
            }
          }
    });

    ws.close = ()=>{
      connection.delete(userId);
    }
});

function checkUser(token: string): string | null {
    try {
      const decoded = jwt.verify(token, "mysecretkey");
  
      if (typeof decoded == "string") {
        return null;
      }
  
      if (!decoded || !decoded.userId) {
        return null;
      }
  
      return decoded.userId.toString();
    } catch(e) {
      return null;
    }
    return null;
  }