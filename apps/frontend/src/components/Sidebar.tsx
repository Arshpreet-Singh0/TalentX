import { Home, Search, PlusSquare, MessageCircle, Menu, User } from 'lucide-react';
import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/hook';
import { clearUser, isUserLoggedIn } from '../redux/authSlice';

const Sidebar = () => {
  const navigte = useNavigate();
  const isUserExist = useAppSelector(isUserLoggedIn);
  const {user} = useAppSelector(store=>store.auth);
  const dispatch = useAppDispatch();

  const handleLogout = ()=>{
      dispatch(clearUser());
  }
  return (
    <aside className="w-16 md:w-64 bg-white border-r border-gray-200">
      <div className="h-full flex flex-col">
        <div className="p-4">
          <h1 className="hidden md:block text-xl font-bold"><span className="text-blue-600 text-4xl italic"> TalentX</span></h1>
          <Menu className="md:hidden w-6 h-6" />
        </div>
        
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
            <SidebarItem icon={<Home />} label="Home" active onClick={()=>navigte('/')}/>
            <SidebarItem icon={<Search />} label="Discover" />
            <SidebarItem icon={<PlusSquare />} label="New Project" onClick={()=>navigte('/newproject')}/>
            <SidebarItem icon={<User />} label="Profile" onClick={()=>navigte(`/profile/${user?.username}`)}/>
            <SidebarItem icon={<MessageCircle />} label="Messages" onClick={()=>navigte('/chats')}/>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          {
            isUserExist ? (
              <button className="hidden md:block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={handleLogout}>
            Logout
          </button>
            ) : (
              <div className='flex flex-col gap-2'>
                  <button className="hidden md:block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={()=>navigte('/signin')}>
            Signin
          </button>
          <button className="hidden md:block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={()=>navigte('/signup')}>
            Signup
          </button>
              </div>
            )
          }
          <PlusSquare className="md:hidden w-6 h-6" />
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, onClick , active = false } : {
  icon : ReactElement,
  label : string,
  active? : boolean,
  onClick? : ()=>void;
}) => {
  return (
    <li onClick={onClick}>
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