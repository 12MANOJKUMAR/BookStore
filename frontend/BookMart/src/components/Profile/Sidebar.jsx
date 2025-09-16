import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Clock, Settings, LogOut } from "lucide-react";

const Sidebar = ({ data }) => {
  const location = useLocation();
  
  const menuItems = [
    { 
      path: "/profile", 
      label: "Favourites", 
      icon: Heart,
      gradient: "from-pink-600 to-rose-600"
    },
    { 
      path: "/profile/orderHistory", 
      label: "Order History", 
      icon: Clock,
      gradient: "from-blue-600 to-indigo-600"
    },
    { 
      path: "/profile/settings", 
      label: "Settings", 
      icon: Settings,
      gradient: "from-purple-600 to-violet-600"
    },
  ];

  return (
    <div className="sidebar bg-gradient-to-b from-zinc-900 to-zinc-800 p-6 rounded-xl shadow-2xl flex flex-col h-full">
      {/* Profile Section */}
      <div className="flex flex-col items-center">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img
            src={data.avatar || "/default-avatar.png"}
            alt="profile-pic"
            className="relative h-24 w-24 rounded-full object-cover border-4 border-zinc-700 group-hover:border-emerald-600/50 transition-all duration-300"
          />
        </div>
        
        <h3 className="text-zinc-100 mt-4 text-xl font-bold tracking-wide">
          {data.username}
        </h3>
        <p className="text-zinc-400 text-sm mt-1">{data.email}</p>
        
        <div className="w-full mt-6 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent"></div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-8 w-full">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group overflow-hidden text-zinc-300 hover:text-white"
                >
                  {/* Gradient Background - Only shows on hover */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-r ${item.gradient}
                    transition-all duration-300 opacity-0 group-hover:opacity-100
                  `}></div>
                  
                  {/* Content */}
                  <Icon 
                    size={20} 
                    className="relative z-10 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="relative z-10 font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-6">
        <button className="
          w-full flex items-center justify-center gap-3 
          bg-gradient-to-r from-red-600 to-red-700 
          hover:from-red-700 hover:to-red-800
          text-white font-semibold py-3 px-4 rounded-lg
          transform transition-all duration-300 
          hover:scale-105 active:scale-95
          shadow-lg hover:shadow-xl
        ">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;