import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import JobCard from "@/components/JobCard";
import JobPostingModal from "@/components/JobPostingModal";
import JobDetailsModal from "@/components/JobDetailsModal";
import JobEditModal from "@/components/JobEditModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useJobs, useDeleteJob } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/lib/api";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const deleteJob = useDeleteJob();
  const { data: jobsResponse, isLoading: jobsLoading, error: jobsError } = useJobs();
  const jobs = jobsResponse?.data?.jobs || [];

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

  return (
    <>
      <RoleBasedNavigation />
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4 text-[#222327]">Jobs</h2>
        <div className="flex items-center space-x-2 sm:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D3559] h-4 w-4" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 backdrop-blur-sm border-white/20 text-sm focus:ring-[#2D3559] focus:border-[#2D3559]"
            />
          </div>
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
                    onEdit={handleEditJob}
                    onDelete={handleDeleteJob}
                  />
                </ErrorBoundary>
              ))
            ) : (
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <p className="text-[#2D3559] text-center">
                    {searchTerm ? "No jobs found matching your search." : "No jobs posted yet."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        {/* Modals */}
        <JobPostingModal isOpen={false} onClose={() => {}} />
        <JobDetailsModal isOpen={isDetailsModalOpen} job={selectedJob} onClose={() => setIsDetailsModalOpen(false)} />
        <JobEditModal isOpen={isEditModalOpen} job={selectedJob} onClose={() => setIsEditModalOpen(false)} />
        <ConfirmDialog 
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Job"
          description="Are you sure you want to delete this job? This action cannot be undone."
          confirmText="Delete"
          variant="destructive"
        />
      </div>
    </>
  );
};

export default Jobs; 