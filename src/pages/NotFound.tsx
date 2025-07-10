import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FF7C23] via-[#A3D958] to-[#2D3559]">
      <div className="text-center bg-white/60 backdrop-blur-sm border-white/20 rounded-2xl p-8 max-w-md mx-4">
        <div className="mb-6">
          <div className="text-8xl font-bold text-[#FF7C23] mb-4">404</div>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7C23] to-[#2D3559] mx-auto rounded-full"></div>
        </div>
        <h1 className="text-2xl font-bold text-[#222327] mb-4">Oops! Page not found</h1>
        <p className="text-[#2D3559] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="border-[#2D3559] text-[#2D3559] hover:bg-[#2D3559] hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-[#FF7C23] to-[#2D3559] hover:from-[#e65a1a] hover:to-[#1a1f2e] text-white transition-all duration-300"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
