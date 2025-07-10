import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search } from "lucide-react";
import CandidateCard from "@/components/CandidateCard";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useCandidates } from "@/hooks/use-api";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";

const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: candidatesResponse, isLoading: candidatesLoading, error: candidatesError } = useCandidates();
  const candidates = candidatesResponse?.data?.candidates || [];

  const filteredCandidates = candidates.filter(candidate =>
    (candidate.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (candidate.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <RoleBasedNavigation />
      <div className="container mx-auto py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
          <h2 className="text-2xl font-bold flex items-center space-x-2 text-[#222327]">
            <Users className="h-6 w-6 text-[#2D3559]" />
            <span>Candidates</span>
          </h2>
          <Badge variant="secondary" className="bg-[#A3D958]/10 text-[#A3D958] text-xs">
            AI Powered Matching
          </Badge>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D3559] h-4 w-4" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 backdrop-blur-sm border-white/20 text-sm focus:ring-[#2D3559] focus:border-[#2D3559]"
            />
          </div>
        </div>
        {candidatesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D3559]"></div>
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
                  <p className="text-[#2D3559] text-center">
                    {searchTerm ? "No candidates found matching your search." : "No candidates available yet."}
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

export default Candidates; 