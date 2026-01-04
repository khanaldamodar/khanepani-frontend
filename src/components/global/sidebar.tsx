"use client"
import React, { useEffect, useState } from 'react';
import {
  Menu,
  X,
  Home,
  FileText,
  Plus,
  List,
  Edit3,
  Image,
  Users,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AdminSidebar = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const token = Cookies.get("token")
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(()=>{
    const getEmail = async()=>{
      try {
        const response = await fetch (`${apiUrl}user`,{
          headers:{
             "Authorization": `Bearer ${token}`
            
          }
        })
        const data = await response.json();
        console.log("Get Login User Details", data);
        setEmail(data.email)
        
      } catch (error) {
        
      }


    }
    getEmail()
  },[])
  const [isMinimized, setIsMinimized] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
    // Close all expanded menus when minimizing
    if (!isMinimized) {
      setExpandedMenus({});
    }
  };

  const toggleSubmenu = (menuKey) => {
    if (isMinimized) return; // Don't expand submenus when minimized
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleLogout = async()=>{
    Cookies.remove("token");
    const logoutResponse = await fetch(`${apiUrl}logout`,{
      method: "POST",
      headers:{
        "Authorization": `Bearer ${token}`,
  }})
  if(logoutResponse.status === 200){
    router.push("/login")
  }

  }

  const menuItems = [
    {
      key: 'dashboard',
      icon: Home,
      label: 'Dashboard',
      path: '/admin/dashboard'
    },
    {
      key: 'documents',
      icon: FileText,
      label: 'Documents',
      submenu: [
        { icon: Plus, label: 'Add Document', path: '/admin/document/add' },
        { icon: List, label: 'All Documents', path: '/admin/document' }
      ]
    },
    {
      key: 'blog',
      icon: Edit3,
      label: 'Blog',
      submenu: [
        { icon: Plus, label: 'Create New', path: '/admin/blog/add' },
        { icon: List, label: 'All Posts', path: '/admin/blog' }
      ]
    },
    {
      key: 'gallery',
      icon: Image,
      label: 'Gallery',
      submenu: [
        { icon: Plus, label: 'Add New', path: '/admin/gallery/add' },
        { icon: List, label: 'Show All', path: '/admin/gallery' }
      ]
    },
    {
      key: 'members',
      icon: Users,
      label: 'Members',
      submenu: [
        { icon: Plus, label: 'Add New', path: '/admin/members/add' },
        { icon: List, label: 'All Members', path: '/admin/members' },
        { icon: List, label: 'Transition Period', path: '/admin/members/transition-period' }
      ]
    },
    {
      key: 'contact',
      icon: Users,
      label: 'Contacts',
      submenu: [
        { icon: List, label: 'All Contacts', path: '/admin/contacts' }
      ]
    },
    {
      key: 'settings',
      icon: Settings,
      label: 'Settings',
        submenu: [
            { icon: Edit3, label: 'General Settings', path: '/admin/settings/general' },
            { icon: List, label: 'User Management', path: '/admin/settings/users' }
        ]
      
    }
  ];

const MenuItem = ({ item }) => {
  const IconComponent = item.icon;
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isExpanded = expandedMenus[item.key];

  const menuContent = (
    <div
      onClick={() => hasSubmenu ? toggleSubmenu(item.key) : null}
      className={`
        flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white
        cursor-pointer transition-all duration-200 group relative
        ${isMinimized ? 'justify-center' : 'justify-between'}
      `}
    >
      <div className="flex items-center">
        <IconComponent size={20} className="flex-shrink-0" />
        {!isMinimized && (
          <span className="ml-3 font-medium">{item.label}</span>
        )}
      </div>

      {/* Tooltip for minimized state */}
      {isMinimized && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
          {item.label}
        </div>
      )}

      {!isMinimized && hasSubmenu && (
        <div className="transition-transform duration-200">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-1 font-poppins">
      {hasSubmenu ? (
        menuContent
      ) : (
        <Link href={item.path}>{menuContent}</Link>  // ✅ Wrap link for no-submenu items
      )}

      {/* Submenu */}
      {hasSubmenu && !isMinimized && (
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="bg-gray-750 border-l-2 border-gray-600 ml-4">
            {item.submenu.map((subItem, index) => {
              const SubIconComponent = subItem.icon;
              return (
                <div
                  key={index}
                  className="flex items-center px-6 py-2 text-gray-400 hover:bg-gray-600 hover:text-white cursor-pointer transition-all duration-200"
                >
                  <Link href={subItem.path} className="flex items-center w-full">
                    <SubIconComponent size={16} className="flex-shrink-0" />
                    <span className="ml-3 text-sm">{subItem.label}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


  return (
    <div className="flex h-[100vh] bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className={`
          fixed top-0 left-0 h-screen bg-gray-800 text-white flex flex-col
          transition-all duration-300 ease-in-out z-50
          ${isMinimized ? "w-16" : "w-64"}
        `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          {!isMinimized && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            {isMinimized ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => (
            <MenuItem key={item.key} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className={`
            flex items-center transition-all duration-200
            ${isMinimized ? 'justify-center' : ''}
          `}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
            {!isMinimized && (
              <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-400">{email}</p>
                <button className='text-red-600 font-bold cursor-pointer' onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
     
    </div>
  );
};

export default AdminSidebar;