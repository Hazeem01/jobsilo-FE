import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Briefcase, Brain, MessageSquare, Calendar, Search, Plus, ArrowRight, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import JobPostingModal from "@/components/JobPostingModal";
import JobDetailsModal from "@/components/JobDetailsModal";
import JobEditModal from "@/components/JobEditModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import AIChat from "@/components/AIChat";
import CandidateCard from "@/components/CandidateCard";
import JobCard from "@/components/JobCard";
import DashboardStats from "@/components/DashboardStats";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useAuth } from "@/contexts/AuthContext";
import { useJobs, useCandidates, useDashboardStats, useDeleteJob } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/lib/api";

const Index = () => {
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const deleteJob = useDeleteJob();
  
  // API hooks
  const { data: jobsResponse, isLoading: jobsLoading, error: jobsError } = useJobs();
  const { data: candidatesResponse, isLoading: candidatesLoading, error: candidatesError } = useCandidates();
  const { data: statsResponse, isLoading: statsLoading, error: statsError } = useDashboardStats();

  // Extract data from responses
  const jobs = jobsResponse?.data?.jobs || [];
  const candidates = candidatesResponse?.data?.candidates || [];
  const stats = statsResponse?.data;

  const handleLogout = async () => {
    await logout();
  };

  // Job management handlers
  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleDeleteJob = (job: Job) => {
    setSelectedJob(job);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedJob) return;
    
    try {
      await deleteJob.mutateAsync(selectedJob.id);
      toast({
        title: "Job Deleted Successfully!",
        description: "The job posting has been removed.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedJob(null);
    } catch (error) {
      toast({
        title: "Failed to delete job",
        description: error instanceof Error ? error.message : "An error occurred while deleting the job",
        variant: "destructive",
      });
    }
  };

  const filteredJobs = jobs.filter(job =>
    (job.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (job.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (job.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const filteredCandidates = candidates.filter(candidate =>
    (candidate.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (candidate.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 flex-shrink-0 z-50">
        <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 sm:p-2 rounded-lg">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Clever Hire
              </h1>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 sm:hidden">
              <Button
                onClick={() => setIsJobModalOpen(true)}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
              <Link to="/applicant">
                <Button variant="outline" size="sm" className="hidden lg:flex">
                  Job Seeker Portal
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              
              <div className="flex items-center space-x-2 lg:space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {user?.role}
                  </Badge>
                </div>
                <Button
                  onClick={() => setIsJobModalOpen(true)}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-1 lg:mr-2" />
                  <span className="hidden lg:inline">Post Job</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1 lg:mr-2" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content and Sidebar Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Dashboard Stats */}
        <ErrorBoundary>
          {statsError ? (
            <Card className="bg-red-50 border-red-200 mb-6 sm:mb-8">
              <CardContent className="pt-6">
                <p className="text-red-600">Failed to load dashboard statistics. Please try again.</p>
              </CardContent>
            </Card>
          ) : (
            <DashboardStats stats={stats} isLoading={statsLoading} />
          )}
        </ErrorBoundary>

        {/* Main Content */}
        <div className="mt-6 sm:mt-8">
          <Tabs defaultValue="jobs" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="jobs" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Jobs</span>
              </TabsTrigger>
              <TabsTrigger value="candidates" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Candidates</span>
              </TabsTrigger>
              <TabsTrigger value="interviews" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Interviews</span>
              </TabsTrigger>
            </TabsList>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 backdrop-blur-sm border-white/20 text-sm"
                  />
                </div>
              </div>
              
              {jobsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : jobsError ? (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-6">
                    <p className="text-red-600">Failed to load jobs. Please try again.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <ErrorBoundary key={job.id}>
                        <JobCard 
                          job={job} 
                          onViewDetails={handleViewDetails}
                          onEdit={handleEditJob}
                          onDelete={handleDeleteJob}
                        />
                      </ErrorBoundary>
                    ))
                  ) : (
                    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                      <CardContent className="pt-6">
                        <p className="text-gray-500 text-center">
                          {searchTerm ? "No jobs found matching your search." : "No jobs posted yet."}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Candidates Tab */}
            <TabsContent value="candidates" className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 flex-shrink-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Top Matched Candidates</h3>
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  AI Powered Matching
                </Badge>
              </div>
              
              {candidatesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : candidatesError ? (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-6">
                    <p className="text-red-600">Failed to load candidates. Please try again.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((candidate) => (
                      <ErrorBoundary key={candidate.id}>
                        <CandidateCard candidate={candidate} />
                      </ErrorBoundary>
                    ))
                  ) : (
                    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                      <CardContent className="pt-6">
                        <p className="text-gray-500 text-center">
                          {searchTerm ? "No candidates found matching your search." : "No candidates available yet."}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Interviews Tab */}
            <TabsContent value="interviews" className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Interview Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Schedule and manage interviews with candidates. This feature will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Sidebar - AI Chat (Fixed) */}
      <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0 border-l border-white/20">
        <div className="h-full bg-white/60 backdrop-blur-sm overflow-hidden">
          <div className="p-4 border-b border-white/20 bg-white/40">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 rounded-lg">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">AI Assistant</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs ml-auto">
                Online
              </Badge>
            </div>
          </div>
          <div className="h-full">
            <AIChat />
          </div>
        </div>
      </div>
    </div>

      {/* Job Posting Modal */}
      <JobPostingModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
      />

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedJob(null);
        }}
        onEdit={() => {
          setIsDetailsModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={() => {
          setIsDetailsModalOpen(false);
          setIsDeleteDialogOpen(true);
        }}
      />

      {/* Job Edit Modal */}
      <JobEditModal
        job={selectedJob}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedJob(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedJob(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Job"
        description={`Are you sure you want to delete "${selectedJob?.title}"? This action cannot be undone.`}
        confirmText="Delete Job"
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleteJob.isPending}
      />
    </div>
  );
};

export default Index;
