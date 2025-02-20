import axios from "axios";
import { Search, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config";
import ChatArea from "./ChatArea";

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  lastMessageAt: Date;
}

const Chat = () => {
  const [currChatUser, setCurrChatUser] = useState<Chat | null>(null);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/recent-chats`, {
          withCredentials: true,
        });
        setRecentChats(res?.data?.recentChats || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    getChats();
  }, []);

  return (
    <div className="bg-gray-50 flex">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {recentChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setCurrChatUser(chat)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                currChatUser?.id === chat.id ? "bg-gray-100" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <UserCircle2 className="w-12 h-12 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {chat.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <ChatArea currChatUser={currChatUser} />
    </div>
  );
};

export default Chat;
