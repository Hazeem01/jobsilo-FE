import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const RecruiterNavigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/recruiter/dashboard" className="flex items-center space-x-3">
          <img src="/logo.svg" alt="Jobsilo Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-[#FF7C23]">
            Jobsilo
          </span>
        </Link>
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/recruiter/jobs" className={({ isActive }) => isActive ? "text-[#FF7C23] font-semibold underline" : "text-[#2D3559] hover:text-[#FF7C23] font-medium transition-colors"}>Jobs</NavLink>
          <NavLink to="/recruiter/candidates" className={({ isActive }) => isActive ? "text-[#FF7C23] font-semibold underline" : "text-[#2D3559] hover:text-[#FF7C23] font-medium transition-colors"}>Candidates</NavLink>
          <NavLink to="/recruiter/interviews" className={({ isActive }) => isActive ? "text-[#FF7C23] font-semibold underline" : "text-[#2D3559] hover:text-[#FF7C23] font-medium transition-colors"}>Interviews</NavLink>
          <NavLink to="/recruiter/settings" className={({ isActive }) => isActive ? "text-[#FF7C23] font-semibold underline" : "text-[#2D3559] hover:text-[#FF7C23] font-medium transition-colors"}>Settings</NavLink>
        </nav>
        {/* User Info & Logout */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/60 rounded-full px-3 py-1 shadow-sm">
            <User className="h-5 w-5 text-[#2D3559]" />
            <span className="text-sm font-medium text-[#2D3559]">{user?.firstName} {user?.lastName}</span>
            <span className="bg-[#A3D958] text-[#2D3559] text-xs font-semibold px-2 py-0.5 rounded-full ml-2">Recruiter</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center">
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </div>
      {/* Mobile Nav */}
      <nav className="md:hidden flex justify-center bg-white/80 border-t border-white/20 py-2 space-x-4">
        <NavLink to="/recruiter/jobs" className={({ isActive }) => isActive ? "text-[#FF7C23] font-semibold underline" : "text-[#2D3559] hover:text-[#FF7C23] font-medium transition-colors"}>Jobs</NavLink>
        <NavLink to="/recruiter/candidates" className={({ isActive }) => isActive ? "text-[#FF7C23] font-semibold underline" : "text-[#2D3559] hover:text-[#FF7C23] font-medium transition-colors"}>Candidates</NavLink>
        <NavLink to="/recruiter/interviews" className={({ isActive }) => isActive ? "text-[#FF7C23] font-semibold underline" : "text-[#2D3559] hover:text-[#FF7C23] font-medium transition-colors"}>Interviews</NavLink>
        <NavLink to="/recruiter/settings" className={({ isActive }) => isActive ? "text-[#FF7C23] font-semibold underline" : "text-[#2D3559] hover:text-[#FF7C23] font-medium transition-colors"}>Settings</NavLink>
      </nav>
    </header>
  );
};

export default RecruiterNavigation; 