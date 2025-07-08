import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, DollarSign, Clock, Building, Calendar, Users, FileText } from "lucide-react";
import type { Job } from "@/lib/api";
import { safeDateFormat } from "@/lib/utils";

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

// Helper function to parse requirements JSON string
const parseRequirements = (requirements: string): string[] => {
  try {
    if (!requirements) return [];
    return JSON.parse(requirements);
  } catch (error) {
    console.error('Failed to parse requirements:', error);
    return [];
  }
};

const JobDetailsModal = ({ job, isOpen, onClose, onEdit, onDelete }: JobDetailsModalProps) => {
  if (!job) return null;

  const formatDate = (dateString: string) => {
    return safeDateFormat(dateString, 'Date unknown');
  };

  const requirements = parseRequirements(job.requirements);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Job Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={job.status === "active" ? "default" : "secondary"} 
                  className="text-sm"
                >
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Key Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Salary Range</p>
                    <p className="text-lg font-semibold text-blue-800">
                      {job.salary_range || 'Not specified'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Job Type</p>
                    <p className="text-lg font-semibold text-purple-800">
                      {job.job_type ? job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1) : 'Not specified'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Posted</p>
                    <p className="text-lg font-semibold text-green-800">
                      {formatDate(job.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description Section */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements Section */}
          {requirements.length > 0 && (
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Required Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {requirements.map((requirement) => (
                    <Badge key={requirement} variant="secondary" className="text-sm">
                      {requirement}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Job ID</p>
                  <p className="text-gray-600 font-mono">{job.id}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Last Updated</p>
                  <p className="text-gray-600">{formatDate(job.updated_at)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Recruiter ID</p>
                  <p className="text-gray-600 font-mono">{job.recruiter_id}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Company ID</p>
                  <p className="text-gray-600">{job.company_id || 'Not assigned'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {onEdit && (
              <Button 
                onClick={onEdit}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Edit Job
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive" 
                onClick={onDelete}
              >
                Delete Job
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal; 