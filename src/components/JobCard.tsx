import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Clock, Users } from "lucide-react";
import type { Job } from "@/lib/api";
import { safeDateFormat, safeArray } from "@/lib/utils";

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

interface JobCardProps {
  job: Job;
  onViewDetails?: (job: Job) => void;
  onEdit?: (job: Job) => void;
  onDelete?: (job: Job) => void;
}

const JobCard = ({ job, onViewDetails, onEdit, onDelete }: JobCardProps) => {
  const formatDate = (dateString: string) => {
    return safeDateFormat(dateString, 'Date unknown');
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
            <p className="text-sm sm:text-base text-gray-600 font-medium">{job.location}</p>
          </div>
          <Badge variant={job.status === "active" ? "default" : "secondary"} className="text-xs flex-shrink-0">
            {job.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>
              {job.salary_range || 'Salary not specified'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {parseRequirements(job.requirements).map((requirement) => (
            <Badge key={requirement} variant="outline" className="text-xs">
              {requirement}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-200 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Posted {formatDate(job.created_at)}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {onViewDetails && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => onViewDetails(job)}
              >
                View Details
              </Button>
            )}
            {onEdit && (
              <Button 
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs"
                onClick={() => onEdit(job)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive" 
                size="sm" 
                className="text-xs"
                onClick={() => onDelete(job)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
