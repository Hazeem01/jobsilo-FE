import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
import JobCard from "@/components/JobCard";
import JobDetailsModal from "@/components/JobDetailsModal";
import ErrorBoundary from "@/components/ErrorBoundary";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import { useJobs } from "@/hooks/use-api";
import { useApplyToJob } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/lib/api";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { toast } = useToast();
  const { data: jobsResponse, isLoading: jobsLoading, error: jobsError } = useJobs({ status: 'active' });
  const applyToJob = useApplyToJob();
  const jobs = jobsResponse?.data?.jobs || [];

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const handleApplyToJob = async (job: Job) => {
    try {
      await applyToJob.mutateAsync({
        jobId: job.id,
        resumeUrl: undefined, // Optional: can be enhanced to include resume selection
        coverLetterUrl: undefined, // Optional: can be enhanced to include cover letter selection
      });
      
      toast({
        title: "Application submitted!",
        description: `Your application for ${job.title} has been submitted successfully.`,
      });
      
      // Close modal if open
      if (isDetailsModalOpen) {
        setIsDetailsModalOpen(false);
      }
    } catch (error) {
      toast({
        title: "Application failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredJobs = jobs.filter(job =>
    (job.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (job.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (job.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (job.company?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <RoleBasedNavigation />
      <div className="container mx-auto py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
          <h2 className="text-2xl font-bold flex items-center space-x-2 text-[#222327]">
            <Briefcase className="h-6 w-6 text-[#2D3559]" />
            <span>Browse Jobs</span>
          </h2>
          <Badge variant="secondary" className="bg-[#2D3559]/10 text-[#2D3559] text-xs">
            AI Matched
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D3559] h-4 w-4" />
            <Input
              placeholder="Search jobs by title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 backdrop-blur-sm border-white/20 text-sm focus:ring-[#2D3559] focus:border-[#2D3559]"
            />
          </div>
        </div>

        {/* Job Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-[#2D3559]" />
                <div>
                  <p className="text-sm font-medium text-[#222327]">Total Jobs</p>
                  <p className="text-2xl font-bold text-[#2D3559]">{jobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#A3D958]" />
                <div>
                  <p className="text-sm font-medium text-[#222327]">Locations</p>
                  <p className="text-2xl font-bold text-[#A3D958]">{new Set(jobs.map(job => job.location)).size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-[#FF7C23]" />
                <div>
                  <p className="text-sm font-medium text-[#222327]">Avg Salary</p>
                  <p className="text-2xl font-bold text-[#FF7C23]">$85K</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {jobsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D3559]"></div>
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
                    onApply={handleApplyToJob}
                    showApplyButton={true}
                  />
                </ErrorBoundary>
              ))
            ) : (
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <p className="text-[#2D3559] text-center">
                    {searchTerm ? "No jobs found matching your search." : "No jobs available at the moment."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Modals */}
        <JobDetailsModal 
          isOpen={isDetailsModalOpen} 
          job={selectedJob} 
          onClose={() => setIsDetailsModalOpen(false)}
          onApply={() => selectedJob && handleApplyToJob(selectedJob)}
          showApplyButton={true}
        />
      </div>
    </>
  );
};

export default Jobs; 