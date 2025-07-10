import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, FileText, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import { useMyApplications } from "@/hooks/use-api";

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: applicationsResponse, isLoading: applicationsLoading, error: applicationsError } = useMyApplications();
  const applications = applicationsResponse?.data?.applications || [];

  const filteredApplications = applications.filter(application =>
    (application.job?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (application.job?.company?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return <Badge className="bg-[#2D3559]/10 text-[#2D3559]">Applied</Badge>;
      case 'reviewing':
        return <Badge className="bg-[#FF7C23]/10 text-[#FF7C23]">Reviewing</Badge>;
      case 'interviewing':
        return <Badge className="bg-[#A3D958]/10 text-[#A3D958]">Interviewing</Badge>;
      case 'offered':
        return <Badge className="bg-[#A3D958]/10 text-[#A3D958]">Offered</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return <FileText className="h-4 w-4 text-[#2D3559]" />;
      case 'reviewing':
        return <Clock className="h-4 w-4 text-[#FF7C23]" />;
      case 'interviewing':
        return <Calendar className="h-4 w-4 text-[#A3D958]" />;
      case 'offered':
        return <CheckCircle className="h-4 w-4 text-[#A3D958]" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-[#2D3559]" />;
    }
  };

  return (
    <>
      <RoleBasedNavigation />
      <div className="container mx-auto py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
          <h2 className="text-2xl font-bold flex items-center space-x-2 text-[#222327]">
            <FileText className="h-6 w-6 text-[#2D3559]" />
            <span>My Applications</span>
          </h2>
          <Badge variant="secondary" className="bg-[#2D3559]/10 text-[#2D3559] text-xs">
            {applications.length} Applications
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D3559] h-4 w-4" />
            <Input
              placeholder="Search applications by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 backdrop-blur-sm border-white/20 text-sm focus:ring-[#2D3559] focus:border-[#2D3559]"
            />
          </div>
        </div>

        {/* Application Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-[#2D3559]" />
                <div>
                  <p className="text-sm font-medium text-[#222327]">Applied</p>
                  <p className="text-2xl font-bold text-[#2D3559]">
                    {applications.filter(app => app.status === 'applied').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-[#FF7C23]" />
                <div>
                  <p className="text-sm font-medium text-[#222327]">Reviewing</p>
                  <p className="text-2xl font-bold text-[#FF7C23]">
                    {applications.filter(app => app.status === 'reviewing').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-[#A3D958]" />
                <div>
                  <p className="text-sm font-medium text-[#222327]">Interviewing</p>
                  <p className="text-2xl font-bold text-[#A3D958]">
                    {applications.filter(app => app.status === 'interviewing').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-[#A3D958]" />
                <div>
                  <p className="text-sm font-medium text-[#222327]">Offered</p>
                  <p className="text-2xl font-bold text-[#A3D958]">
                    {applications.filter(app => app.status === 'offered').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {applicationsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D3559]"></div>
          </div>
        ) : applicationsError ? (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-600">Failed to load applications. Please try again.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <Card key={application.id} className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(application.status)}
                          <h3 className="font-semibold text-lg text-[#222327]">{application.job?.title}</h3>
                        </div>
                        <p className="text-[#2D3559] mb-2">{application.job?.company}</p>
                        <p className="text-sm text-[#2D3559]/70 mb-3">{application.job?.location}</p>
                        <div className="flex items-center space-x-4 text-sm text-[#2D3559]">
                          <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                          <span>Updated: {new Date(application.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(application.status)}
                        <div className="flex space-x-2">
                          {application.resumeUrl && (
                            <Button variant="outline" size="sm" className="hover:bg-[#2D3559]/10 hover:text-[#2D3559] transition-all duration-300">
                              <FileText className="h-4 w-4 mr-1" />
                              Resume
                            </Button>
                          )}
                          {application.coverLetterUrl && (
                            <Button variant="outline" size="sm" className="hover:bg-[#2D3559]/10 hover:text-[#2D3559] transition-all duration-300">
                              <FileText className="h-4 w-4 mr-1" />
                              Cover Letter
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <p className="text-[#2D3559] text-center">
                    {searchTerm ? "No applications found matching your search." : "No applications yet. Start applying to jobs!"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Applications; 