import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Building, Settings } from "lucide-react";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import DashboardStats from "@/components/DashboardStats";
import { useDashboardStats } from "@/hooks/use-api";

const Dashboard = () => {
  const { data: statsResponse, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const stats = statsResponse?.data;

  return (
    <>
      <RoleBasedNavigation />
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6 text-[#222327]">Admin Dashboard</h2>
        
        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStats stats={stats} isLoading={statsLoading} />
        </div>

        {/* Admin Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#222327]">Total Users</CardTitle>
              <Users className="h-4 w-4 text-[#2D3559]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#FF7C23]">1,234</div>
              <p className="text-xs text-[#2D3559]">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#222327]">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-[#2D3559]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2D3559]">567</div>
              <p className="text-xs text-[#2D3559]">+12.3% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#222327]">Companies</CardTitle>
              <Building className="h-4 w-4 text-[#2D3559]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#A3D958]">89</div>
              <p className="text-xs text-[#2D3559]">+5.2% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#222327]">System Health</CardTitle>
              <Settings className="h-4 w-4 text-[#2D3559]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#A3D958]">98.5%</div>
              <p className="text-xs text-[#2D3559]">All systems operational</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard; 