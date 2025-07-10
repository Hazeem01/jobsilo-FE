import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Briefcase, Mail, Phone } from "lucide-react";
import type { Candidate } from "@/lib/api";
import { safeDateFormat, getInitials } from "@/lib/utils";

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hired':
        return "text-[#A3D958] bg-[#A3D958] bg-opacity-10";
      case 'interviewed':
        return "text-[#FF7C23] bg-[#FF7C23] bg-opacity-10";
      case 'reviewing':
        return "text-[#2D3559] bg-[#2D3559] bg-opacity-10";
      case 'rejected':
        return "text-[#222327] bg-[#222327] bg-opacity-10";
      default:
        return "text-[#2D3559] bg-[#2D3559] bg-opacity-5";
    }
  };

  const formatDate = (dateString: string) => {
    return safeDateFormat(dateString, 'Date unknown');
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-r from-[#FF7C23] to-[#2D3559] text-white font-semibold text-sm sm:text-base">
              {getInitials(candidate.name, 'U')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-[#222327] truncate">{candidate.name || 'Unknown Candidate'}</h3>
                <p className="text-sm text-[#2D3559] truncate">{candidate.email || 'No email provided'}</p>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Badge className={`${getStatusColor(candidate.status)} border-0 text-xs`}>
                  {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2 text-xs sm:text-sm text-[#2D3559]">
              <div className="flex items-center space-x-1">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{candidate.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{candidate.phone || 'No phone provided'}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-2 text-xs sm:text-sm text-[#2D3559]">
              <div className="flex items-center space-x-1">
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Applied {safeDateFormat(candidate.created_at, 'Date unknown')}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
              <Button variant="outline" size="sm" className="text-xs">
                View Profile
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-[#FF7C23] to-[#2D3559] hover:from-[#FF7C23] hover:to-[#A3D958] text-white text-xs"
              >
                Contact
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Schedule Interview
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
