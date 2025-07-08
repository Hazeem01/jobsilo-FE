import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, Calendar, TrendingUp } from "lucide-react";
import type { DashboardStats as DashboardStatsType } from "@/lib/api";
import { safeNumberFormat } from "@/lib/utils";

interface DashboardStatsProps {
  stats?: DashboardStatsType;
  isLoading?: boolean;
}

const DashboardStats = ({ stats, isLoading }: DashboardStatsProps) => {
  const defaultStats = [
    {
      title: "Active Jobs",
      value: "0",
      change: "No data",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Candidates",
      value: "0",
      change: "No data",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Upcoming Interviews",
      value: "0",
      change: "No data",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Recent Candidates",
      value: "0",
      change: "No data",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const displayStats = stats ? [
    {
      title: "Active Jobs",
      value: safeNumberFormat(stats.activeJobs, '0'),
      change: `${safeNumberFormat(stats.totalJobs, '0')} total jobs`,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Candidates",
      value: safeNumberFormat(stats.totalCandidates, '0'),
      change: `${safeNumberFormat(stats.interviewsScheduled, '0')} interviews scheduled`,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Interviews Scheduled",
      value: safeNumberFormat(stats.interviewsScheduled, '0'),
      change: `${safeNumberFormat(stats.hiresThisMonth, '0')} hires this month`,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Average Time to Hire",
      value: `${safeNumberFormat(stats.averageTimeToHire, '0')} days`,
      change: "Last 30 days",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ] : defaultStats;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {displayStats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
