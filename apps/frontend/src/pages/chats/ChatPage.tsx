import Chat from "../../components/Chat/Chat";
import Sidebar from "../../components/Sidebar";

function ChatPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <Chat />
    </div>
  );
}

export default ChatPage;
