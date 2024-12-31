import React, { useState, useEffect, MouseEvent } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  User,
  ClipboardList,
  DollarSign,
  LogOut,
  BookOpen,
  CheckSquare,
} from "lucide-react";
import { FaFile } from "react-icons/fa";
import { useLogin } from "../auth/LoginContext";
import { useSidebar } from "../auth/SidebarContext ";


interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
}

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const { logout } = useLogin();
  const { isSidebarOpen } = useSidebar();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
  };

  const renderSidebarItems = () => {
    if (!user) return null;

    switch (user.user_type) {
      case "HR":
        return (
          <>
            <li className="flex items-center space-x-2 ml-4">
              <User className="w-6 h-6" />
              <Link to="/profile" className="block py-2.5 px-4 text-sm hover:bg-blue-700">
                Profile
              </Link>
            </li>
            <li className="flex items-center space-x-2 ml-4">
              <ClipboardList className="w-6 h-6" />
              <Link to="/resume_upload" className="block py-2.5 px-4 text-sm hover:bg-blue-700">
                Candidate Screening
              </Link>
            </li>
            <li className="flex items-center space-x-2 ml-4">
              <FaFile className="w-6 h-6" />
              <Link to="/hr_Total_ResumeUploaded" className="block py-2.5 px-4 text-sm hover:bg-blue-700">
                Resume Analysis Report
              </Link>
            </li>
            <li className="flex items-center space-x-2 ml-4">
              <Users className="w-6 h-6" />
              <Link to="/selected_candidate" className="block py-2.5 px-4 text-sm hover:bg-blue-700">
                Selected Candidate
              </Link>
            </li>
            <li className="flex items-center space-x-2 ml-4">
              <CheckSquare className="w-6 h-6" />
              <Link to="/result" className="block py-2.5 px-4 text-sm hover:bg-blue-700">
                Interview Report
              </Link>
            </li>
          </>
        );

      case "admin":
        return (
          <>
            <li className="flex items-center space-x-2 ml-4">
              <ClipboardList className="w-6 h-6" />
              <Link to="/admin_business_msg" className="block py-2.5 px-4 text-sm hover:bg-blue-700">
                Business Message
              </Link>
            </li>
            <li className="flex items-center space-x-2 ml-4">
              <Users className="w-6 h-6" />
              <Link to="/all_users" className="block py-2.5 px-4 text-sm hover:bg-blue-700">
                All Users
              </Link>
            </li>
            <li className="flex items-center space-x-2 ml-4">
              <BookOpen className="w-6 h-6" />
              <Link to="/hr_activity" className="block py-2.5 px-4 text-sm hover:bg-blue-700">
                HR Activity
              </Link>
            </li>
            <li className="flex items-center space-x-2 ml-4">
              <CheckSquare className="w-6 h-6" />
              <Link to="/All_hr_candidate_report" className="block py-2.5 px-4 text-sm hover:bg-blue-700">
                All HR Candidate
              </Link>
            </li>
          </>
        );

      case "students":
        return (
          <>
            <li className="flex items-center space-x-2 ml-4">
              <User className="w-6 h-6" />
              <Link to="/profile" className="block py-2.5 px-4 text-sm hover:bg-blue-700">
                Profile
              </Link>
            </li>
            <li className="flex items-center space-x-2 ml-4">
              <DollarSign className="w-6 h-6" />
              <Link to="/resume_builder" className="block py-2.5 px-4 text-sm hover:bg-blue-700">
                Resume Builder
              </Link>
            </li>
            <li className="flex items-center space-x-2 ml-4">
              <BookOpen className="w-6 h-6" />
              <Link to="/grades" className="block py-2.5 px-4 text-sm hover:bg-blue-700">
                My Grades
              </Link>
            </li>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {isSidebarOpen && (
        <aside className="fixed top-0 left-0 w-64 bg-blue-900 text-white flex flex-col h-screen overflow-y-auto">
          <div className="p-4 flex items-center space-x-4">
            <h1 className="text-xl font-bold">MaitriAI</h1>
          </div>
          <nav className="flex-grow mt-6">
            <ul className="space-y-2">{renderSidebarItems()}</ul>
          </nav>
          <div className="flex items-center space-x-2 ml-4 mb-6">
            <LogOut className="w-6 h-6" />
            <Link to="/" className="block py-2.5 px-4 text-sm hover:bg-blue-700" onClick={handleLogout}>
              Logout
            </Link>
          </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
