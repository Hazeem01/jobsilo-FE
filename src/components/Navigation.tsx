import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, User, LogOut } from "lucide-react";

interface NavigationProps {
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export const Navigation = ({
  onLoginClick,
  onLogoutClick,
}: NavigationProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    onLogoutClick?.();
  };

  return (
    <nav className='bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50'>
      <div className='container mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          <Link to='/' className='flex items-center space-x-3'>
            <img src='/logo.svg' alt='Jobsilo Logo' className='h-8 w-8' />
            <h1 className='text-2xl font-bold text-[#FF7C23]'>Jobsilo</h1>
          </Link>

          <div className='flex items-center space-x-4'>
            {isAuthenticated ? (
              <>
                <div className='flex items-center space-x-2'>
                  <User className='h-4 w-4 text-[#2D3559]' />
                  <span className='text-sm font-medium text-[#222327]'>
                    {user?.firstName}
                  </span>
                </div>

                {user?.role === 'recruiter' && (
                  <Link to='/recruiter/dashboard'>
                    <Button
                      variant='outline'
                      className='border-[#2D3559]/20 text-[#2D3559] hover:bg-[#2D3559] hover:text-white'
                    >
                      Dashboard
                    </Button>
                  </Link>
                )}

                <Link to='/applicant/dashboard'>
                  <Button
                    variant='outline'
                    className='border-[#2D3559]/20 text-[#2D3559] hover:bg-[#2D3559] hover:text-white'
                  >
                    Job Portal
                  </Button>
                </Link>

                <Button
                  variant='outline'
                  onClick={handleLogout}
                  className='border-[#2D3559]/20 text-[#2D3559] hover:bg-[#2D3559] hover:text-white'
                >
                  <LogOut className='h-4 w-4 mr-2' />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onLoginClick}
                  className='bg-gradient-to-r from-[#FF7C23] to-[#2D3559] hover:from-[#FF7C23] hover:to-[#A3D958] text-white'
                >
                  <User className='h-4 w-4 mr-2' />
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
