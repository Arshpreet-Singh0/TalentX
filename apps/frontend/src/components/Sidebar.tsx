import { Home, Search, PlusSquare, Heart, MessageCircle, Menu } from 'lucide-react';
import { ReactElement } from 'react';

const Sidebar = () => {
  return (
    <aside className="w-16 md:w-64 bg-white border-r border-gray-200">
      <div className="h-full flex flex-col">
        <div className="p-4">
          <h1 className="hidden md:block text-xl font-bold"><span className="text-blue-600 text-4xl italic"> TalentX</span></h1>
          <Menu className="md:hidden w-6 h-6" />
        </div>
        
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
            <SidebarItem icon={<Home />} label="Home" active />
            <SidebarItem icon={<Search />} label="Discover" />
            <SidebarItem icon={<PlusSquare />} label="New Project" />
            <SidebarItem icon={<Heart />} label="Liked" />
            <SidebarItem icon={<MessageCircle />} label="Messages" />
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button className="hidden md:block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Share Project
          </button>
          <PlusSquare className="md:hidden w-6 h-6" />
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, active = false } : {
  icon : ReactElement,
  label : string,
  active? : boolean
}) => {
  return (
    <li>
      <a
        href="#"
        className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
          active
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {icon}
        <span className="hidden md:block">{label}</span>
      </a>
    </li>
  );
};

export default Sidebar;