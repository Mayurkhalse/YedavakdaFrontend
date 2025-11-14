import { NavLink } from 'react-router-dom';
import { Map, BarChart3, Wheat, MessageCircle, LogOut, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/insights', icon: Wheat, label: 'Crop Insights' },
    { path: '/chatbot', icon: MessageCircle, label: 'Chatbot' },
  ];

  return (
    <div className="w-20 bg-gradient-to-b from-green-700 to-green-900 h-screen fixed left-0 top-0 flex flex-col items-center py-6 shadow-2xl z-50">
      <div className="mb-8">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <Sprout className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-4 w-full px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white text-green-700 shadow-lg scale-105'
                  : 'text-green-100 hover:bg-green-600 hover:scale-105'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 py-3 px-4 rounded-xl text-red-200 hover:bg-red-600 hover:text-white transition-all duration-200 hover:scale-105"
      >
        <LogOut className="w-6 h-6" />
        <span className="text-xs font-medium">Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;
