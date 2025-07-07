
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Briefcase, Star } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  title: string;
  experience: string;
  skills: string[];
  location: string;
  match: number;
  avatar: string;
}

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const getMatchColor = (match: number) => {
    if (match >= 90) return "text-green-600 bg-green-100";
    if (match >= 80) return "text-blue-600 bg-blue-100";
    return "text-orange-600 bg-orange-100";
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
              {candidate.avatar}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                <p className="text-gray-600">{candidate.title}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className={`${getMatchColor(candidate.match)} border-0`}>
                  <Star className="h-3 w-3 mr-1" />
                  {candidate.match}% Match
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Briefcase className="h-4 w-4" />
                <span>{candidate.experience}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{candidate.location}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" size="sm">
                View Profile
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Contact
              </Button>
              <Button variant="outline" size="sm">
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
