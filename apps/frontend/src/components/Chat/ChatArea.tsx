import { Send, User, UserCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../hooks/hook";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useSocket } from "../../hooks/useSocket";

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  lastMessageAt: Date;
}

interface Message {
  id: number;
  message: string;
  senderId: number;
  timestamp: Date;
}

const ChatArea = ({ currChatUser }: { currChatUser: Chat | null }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const { ws } = useSocket();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAppSelector((store) => store.auth);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (currChatUser) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(
            `${BACKEND_URL}/messages/${currChatUser.id}`,
            { withCredentials: true }
          );
          setMessages(res?.data?.chats || []);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();
    }
  }, [currChatUser]);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (e) => {
        const parsedData = JSON.parse(e.data);

        setMessages((prev) => [...prev, parsedData]);
      };
    }
  }, [ws]);

  const handleSend = async () => {
    if (!newMessage.trim() || !currChatUser) return;

    const newMsg: Message = {
      id: messages.length + 1,
      message: newMessage,
      senderId: Number(user.id),
      timestamp: new Date(),
    };

    ws?.send(
      JSON.stringify({
        message: newMessage,
        receiverId: currChatUser.id,
        type: "chat",
      })
    );

    setMessages((prev: any) => [...prev, newMsg]);
    setNewMessage("");
  };
  return (
    <div className="flex-1 w-[1000px] mx-auto">
      <div className="max-w-4xl mx-auto p-4">
        {/* Chat Header */}
        <div className="bg-white rounded-t-lg shadow-sm p-4 border-b">
          {currChatUser ? (
            <div className="flex items-center space-x-3">
              <UserCircle2 className="w-10 h-10 text-gray-400" />
              <div>
                <h2 className="font-semibold text-gray-800">
                  {currChatUser.name}
                </h2>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select a chat to start messaging</p>
          )}
        </div>

        {/* Chat Messages */}
        <div className="bg-white h-[600px] overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === Number(user.id)
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[70%] ${
                  message.senderId === Number(user.id) ? "flex-row-reverse" : ""
                }`}
              >
                <User className="w-8 h-8 text-gray-400 flex-shrink-0" />
                <div
                  className={`rounded-lg p-3 ${
                    message.senderId === Number(user.id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === Number(user.id)
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {/* Timestamp logic */}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {currChatUser && (
          <div className="bg-white p-4 border-t flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;
