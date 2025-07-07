
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Briefcase, Brain, MessageSquare, Calendar, Search, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import JobPostingModal from "@/components/JobPostingModal";
import AIChat from "@/components/AIChat";
import CandidateCard from "@/components/CandidateCard";
import JobCard from "@/components/JobCard";
import DashboardStats from "@/components/DashboardStats";

const Index = () => {
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120k - $160k",
      type: "Full-time",
      tags: ["React", "TypeScript", "Next.js"],
      applicants: 24,
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$90k - $130k",
      type: "Full-time",
      tags: ["Product Strategy", "Agile", "Analytics"],
      applicants: 18,
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      salary: "$80k - $110k",
      type: "Contract",
      tags: ["Figma", "User Research", "Prototyping"],
      applicants: 31,
      posted: "3 days ago"
    }
  ];

  const candidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Frontend Developer",
      experience: "5 years",
      skills: ["React", "Vue.js", "TypeScript", "Node.js"],
      location: "Seattle, WA",
      match: 95,
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Product Manager",
      experience: "7 years",
      skills: ["Product Strategy", "Data Analysis", "Scrum"],
      location: "Austin, TX",
      match: 88,
      avatar: "MC"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "UX Designer",
      experience: "4 years",
      skills: ["Figma", "Adobe XD", "User Research"],
      location: "Los Angeles, CA",
      match: 92,
      avatar: "ER"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Recruiter
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/applicant">
                <Button variant="outline">
                  Job Seeker Portal
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Button
                onClick={() => setIsJobModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mt-8">
          {/* Left Content */}
          <div className="xl:col-span-3">
            <Tabs defaultValue="jobs" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
                <TabsTrigger value="jobs" className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Jobs</span>
                </TabsTrigger>
                <TabsTrigger value="candidates" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Candidates</span>
                </TabsTrigger>
                <TabsTrigger value="interviews" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Interviews</span>
                </TabsTrigger>
              </TabsList>

              {/* Jobs Tab */}
              <TabsContent value="jobs" className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/50 backdrop-blur-sm border-white/20"
                    />
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </TabsContent>

              {/* Candidates Tab */}
              <TabsContent value="candidates" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Top Matched Candidates</h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    AI Powered Matching
                  </Badge>
                </div>
                
                <div className="grid gap-6">
                  {candidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                  ))}
                </div>
              </TabsContent>

              {/* Interviews Tab */}
              <TabsContent value="interviews" className="space-y-6">
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span>Upcoming Interviews</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">Sarah Johnson</h4>
                          <p className="text-sm text-gray-600">Frontend Developer Position</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Today, 2:00 PM</p>
                          <p className="text-sm text-gray-600">Video Call</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">Michael Chen</h4>
                          <p className="text-sm text-gray-600">Product Manager Position</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Tomorrow, 10:00 AM</p>
                          <p className="text-sm text-gray-600">In-Person</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - AI Chat */}
          <div className="xl:col-span-1">
            <AIChat />
          </div>
        </div>
      </div>

      {/* Job Posting Modal */}
      <JobPostingModal open={isJobModalOpen} onOpenChange={setIsJobModalOpen} />
    </div>
  );
};

export default Index;
