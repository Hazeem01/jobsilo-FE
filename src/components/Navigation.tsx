import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, User, LogOut } from "lucide-react";

interface NavigationProps {
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export const Navigation = ({ onLoginClick, onLogoutClick }: NavigationProps) => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onLogoutClick?.();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Clever Hire
            </h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>
                
                {user?.role === 'recruiter' && (
                  <Link to="/dashboard">
                    <Button variant="outline">
                      Dashboard
                    </Button>
                  </Link>
                )}
                
                <Link to="/applicant">
                  <Button variant="outline">
                    Job Portal
                  </Button>
                </Link>
                
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/applicant">
                  <Button variant="outline">
                    Job Seeker Portal
                  </Button>
                </Link>
                
                <Button onClick={onLoginClick}>
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}; 