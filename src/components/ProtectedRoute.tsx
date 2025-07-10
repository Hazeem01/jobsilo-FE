import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "recruiter" | "applicant" | "admin";
  fallback?: ReactNode;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  fallback,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#FF7C23] to-[#2D3559] flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7C23] mx-auto mb-4'></div>
          <p className='text-[#2D3559]'>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth modal
  if (!isAuthenticated) {
    return (
      <>
        {fallback || (
          <div className='min-h-screen bg-gradient-to-br from-[#FF7C23] to-[#2D3559] flex items-center justify-center'>
            <div className='text-center max-w-md mx-auto p-8'>
              <div className='bg-white/60 backdrop-blur-sm border-white/20 rounded-lg p-8 shadow-lg'>
                <h2 className='text-2xl font-bold text-[#222327] mb-4'>
                  Authentication Required
                </h2>
                <p className='text-[#2D3559] mb-6'>
                  Please sign in to access this page.
                </p>
                <div className='space-y-3'>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className='w-full bg-gradient-to-r from-[#FF7C23] to-[#2D3559] hover:from-[#FF7C23] hover:to-[#A3D958] text-white font-medium py-2 px-4 rounded-lg transition-colors'
                  >
                    Sign In
                  </button>
                  <Link
                    to='/'
                    className='block w-full bg-white/60 backdrop-blur-sm border border-[#2D3559]/20 text-[#2D3559] hover:bg-white/80 font-medium py-2 px-4 rounded-lg transition-colors'
                  >
                    Go Back Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  // If role is required and user doesn't have the required role
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#FF7C23] to-[#2D3559] flex items-center justify-center'>
        <div className='text-center max-w-md mx-auto p-8'>
          <div className='bg-white/60 backdrop-blur-sm border-white/20 rounded-lg p-8 shadow-lg'>
            <h2 className='text-2xl font-bold text-[#222327] mb-4'>
              Access Denied
            </h2>
            <p className='text-[#2D3559] mb-6'>
              You don't have permission to access this page. This page is only
              available to {requiredRole}s.
            </p>
            <div className='space-y-2'>
              <p className='text-sm text-[#2D3559]'>
                Your current role:{" "}
                <span className='font-medium'>{user?.role}</span>
              </p>
              <p className='text-sm text-[#2D3559]'>
                Required role:{" "}
                <span className='font-medium'>{requiredRole}</span>
              </p>
            </div>
            <div className='mt-6'>
              <Link
                to='/'
                className='text-[#FF7C23] hover:text-[#A3D958] underline font-medium'
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and has required role (if specified)
  return <>{children}</>;
};
