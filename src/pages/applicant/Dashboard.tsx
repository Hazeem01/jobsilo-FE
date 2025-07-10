import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  Loader2,
  Briefcase,
  Calendar,
  Trash2,
  FileCheck,
  Award,
  MessageSquare,
  Sparkles,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  useUploadResume,
  useParseResume,
  useAnalyzeJob,
  useGenerateResume,
  useGenerateCoverLetter,
  useExportResume,
  useProSignup,
  useJobs,
  useApplicantInterviews,
  useUserFiles,
  useDeleteFile,
  useMyApplications,
  useApplyToJob,
} from "@/hooks/use-api";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import AIChat from "@/components/AIChat";
import ResumeUpload from "@/components/ResumeUpload";
import JobAnalysis from "@/components/JobAnalysis";
import ResumeGenerator from "@/components/ResumeGenerator";
import CoverLetterGenerator from "@/components/CoverLetterGenerator";
import PdfExporter from "@/components/PdfExporter";
import { Helmet } from "react-helmet-async";

// Document templates for different industries
const documentTemplates = {
  "Software Engineer": {
    style: "professional",
    tone: "confident",
    focus: ["technical skills", "project experience", "problem solving"],
    keywords: ["React", "TypeScript", "Node.js", "AWS", "Docker"],
  },
  "Marketing Manager": {
    style: "creative",
    tone: "enthusiastic",
    focus: ["campaign results", "leadership", "brand growth"],
    keywords: ["Digital Marketing", "SEO", "Social Media", "Analytics"],
  },
  "Data Scientist": {
    style: "professional",
    tone: "formal",
    focus: ["analytical skills", "machine learning", "data visualization"],
    keywords: ["Python", "SQL", "TensorFlow", "Tableau", "Statistics"],
  },
  "UX Designer": {
    style: "creative",
    tone: "enthusiastic",
    focus: ["user research", "design thinking", "prototyping"],
    keywords: ["Figma", "Sketch", "User Testing", "Wireframing"],
  },
  "Sales Representative": {
    style: "professional",
    tone: "confident",
    focus: ["sales achievements", "relationship building", "targets"],
    keywords: ["CRM", "Lead Generation", "Negotiation", "Pipeline"],
  },
};

// AI enhancement suggestions
const aiSuggestions = [
  "Add quantifiable achievements to make your resume stand out",
  "Include industry-specific keywords for better ATS optimization",
  "Highlight transferable skills that apply to multiple roles",
  "Use action verbs to describe your responsibilities",
  "Include metrics and percentages to demonstrate impact",
];

const ApplicantDashboard = () => {
  // State management
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [workHistory, setWorkHistory] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [email, setEmail] = useState("");
  const [generatedResume, setGeneratedResume] = useState("");
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Software Engineer");
  const [resumePreferences, setResumePreferences] = useState({
    tone: "professional" as "professional" | "creative" | "minimalist",
    focus: [] as string[],
  });

  // Document management states
  const [documentHistory, setDocumentHistory] = useState<
    Array<{
      id: string;
      type: "resume" | "cover_letter";
      content: string;
      timestamp: string;
      version: number;
    }>
  >([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAIEnhancements, setShowAIEnhancements] = useState(false);
  const [documentNotes, setDocumentNotes] = useState("");
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { toast } = useToast();
  const { user } = useAuth();

  // API hooks
  const uploadResume = useUploadResume();
  const parseResume = useParseResume();
  const analyzeJob = useAnalyzeJob();
  const generateResume = useGenerateResume();
  const generateCoverLetter = useGenerateCoverLetter();
  const exportResume = useExportResume();
  const proSignup = useProSignup();
  const deleteFile = useDeleteFile();
  const applyToJob = useApplyToJob();

  // Data fetching
  const { data: jobsResponse, isLoading: jobsLoading } = useJobs({
    status: "active",
  });
  const { data: interviewsResponse, isLoading: interviewsLoading } =
    useApplicantInterviews();
  const { data: filesResponse, isLoading: filesLoading } = useUserFiles();
  const { data: applicationsResponse, isLoading: applicationsLoading } =
    useMyApplications();

  const jobs = jobsResponse?.data?.jobs || [];
  const interviews = interviewsResponse?.data?.interviews || [];
  const files = filesResponse?.data?.files || [];
  const applications = applicationsResponse?.data?.applications || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      toast({
        title: "Resume uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handleTemplateSelect = (template: string) => {
    const templateConfig =
      documentTemplates[template as keyof typeof documentTemplates];
    if (templateConfig) {
      setResumePreferences({
        tone: templateConfig.tone as "professional" | "creative" | "minimalist",
        focus: templateConfig.focus,
      });
      setSelectedTemplate(template);
      toast({
        title: "Template applied",
        description: `${template} template has been applied to your preferences.`,
      });
    }
  };

  const handleSaveDocument = (type: "resume" | "cover_letter") => {
    const content = type === "resume" ? generatedResume : generatedCoverLetter;
    if (!content) {
      toast({
        title: "No content to save",
        description: "Please generate content before saving.",
        variant: "destructive",
      });
      return;
    }

    const newDocument = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date().toISOString(),
      version: documentHistory.filter(doc => doc.type === type).length + 1,
    };

    setDocumentHistory(prev => [...prev, newDocument]);
    toast({
      title: "Document saved",
      description: `${type === "resume" ? "Resume" : "Cover letter"} has been saved to your history.`,
    });
  };

  const handleRestoreVersion = (documentId: string) => {
    const document = documentHistory.find(doc => doc.id === documentId);
    if (document) {
      if (document.type === "resume") {
        setGeneratedResume(document.content);
      } else {
        setGeneratedCoverLetter(document.content);
      }
      toast({
        title: "Version restored",
        description: `Previous version of your ${document.type} has been restored.`,
      });
    }
  };

  const handleGenerate = async () => {
    if (!workHistory || !jobDescription) {
      toast({
        title: "Missing information",
        description: "Please provide both work history and job description.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await generateResume.mutateAsync({
        currentResume: workHistory,
        jobDescription: jobDescription,
        preferences: resumePreferences,
      });
      setGeneratedResume(result.content);
      toast({
        title: "Resume generated!",
        description: "Your AI-enhanced resume has been created.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (type: "resume" | "cover_letter") => {
    const content = type === "resume" ? generatedResume : generatedCoverLetter;
    if (!content) {
      toast({
        title: "No content to export",
        description: "Please generate content before exporting.",
        variant: "destructive",
      });
      return;
    }

    try {
      await exportResume.mutateAsync({
        content: content,
        type: type,
        filename: `${type}_${Date.now()}.pdf`,
      });
      toast({
        title: "Document exported!",
        description: `Your ${type} has been exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProSignup = async () => {
    try {
      await proSignup.mutateAsync({
        email: email,
        plan: "pro",
      });
      toast({
        title: "Pro upgrade initiated!",
        description: "Check your email for upgrade instructions.",
      });
    } catch (error) {
      toast({
        title: "Upgrade failed",
        description: "There was an error processing your upgrade. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteFile.mutateAsync(fileId);
      toast({
        title: "File deleted",
        description: "File has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "There was an error deleting the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApplyToJob = async (jobId: string) => {
    try {
      await applyToJob.mutateAsync({
        jobId: jobId,
        resumeUrl: undefined,
        coverLetterUrl: undefined,
      });
      toast({
        title: "Application submitted!",
        description: "Your application has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Application failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Applicant Dashboard - Jobsilo</title>
        <meta name="description" content="AI-powered job application dashboard for applicants" />
      </Helmet>
      
      <RoleBasedNavigation />
      
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2D3559] to-[#FF7C23] bg-clip-text text-transparent">
              Welcome back, {user?.firstName || "Applicant"}!
            </h1>
            <p className="text-[#2D3559] mt-2">
              Let AI help you land your dream job with smart tools and insights.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setActiveTab("ai-tools")}
              className="bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Tools
            </Button>
            <Button
              onClick={handleProSignup}
              className="bg-gradient-to-r from-[#2D3559] to-[#FF7C23] hover:from-[#1a1f2e] hover:to-[#e65a1a] transition-all duration-300"
            >
              <Award className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-[#2D3559]/10 to-[#2D3559]/20 border-[#2D3559]/20 hover:bg-gradient-to-r hover:from-[#2D3559]/20 hover:to-[#2D3559]/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-[#2D3559]" />
                <div>
                  <p className="text-sm font-medium text-[#222327]">Active Jobs</p>
                  <p className="text-2xl font-bold text-[#2D3559]">{jobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-[#A3D958]/10 to-[#A3D958]/20 border-[#A3D958]/20 hover:bg-gradient-to-r hover:from-[#A3D958]/20 hover:to-[#A3D958]/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileCheck className="h-5 w-5 text-[#A3D958]" />
                <div>
                  <p className="text-sm font-medium text-[#222327]">Applications</p>
                  <p className="text-2xl font-bold text-[#A3D958]">{applications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-[#FF7C23]/10 to-[#FF7C23]/20 border-[#FF7C23]/20 hover:bg-gradient-to-r hover:from-[#FF7C23]/20 hover:to-[#FF7C23]/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#FF7C23]" />
                <div>
                  <p className="text-sm font-medium text-[#222327]">Interviews</p>
                  <p className="text-2xl font-bold text-[#FF7C23]">{interviews.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-[#2D3559]/10 to-[#2D3559]/20 border-[#2D3559]/20 hover:bg-gradient-to-r hover:from-[#2D3559]/20 hover:to-[#2D3559]/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-[#2D3559]" />
                <div>
                  <p className="text-sm font-medium text-[#222327]">Documents</p>
                  <p className="text-2xl font-bold text-[#2D3559]">{files.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Jobs */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-[#222327]">
                    <Briefcase className="h-5 w-5 text-[#2D3559]" />
                    <span>Recent Job Opportunities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {jobsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#2D3559]" />
                    </div>
                  ) : jobs.length > 0 ? (
                    <div className="space-y-3">
                      {jobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-3 bg-[#2D3559]/5 rounded-lg hover:bg-[#2D3559]/10 transition-all duration-300">
                          <div className="flex-1">
                            <h4 className="font-medium text-[#222327]">{job.title}</h4>
                            <p className="text-sm text-[#2D3559]">{job.company}</p>
                            <p className="text-xs text-[#2D3559]/70">{job.location}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleApplyToJob(job.id)}
                            className="bg-gradient-to-r from-[#A3D958] to-[#8BC34A] hover:from-[#8BC34A] hover:to-[#689F38] transition-all duration-300"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Apply
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#2D3559] text-center py-4">No jobs available at the moment.</p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-[#222327]">
                    <FileCheck className="h-5 w-5 text-[#A3D958]" />
                    <span>Recent Applications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#A3D958]" />
                    </div>
                  ) : applications.length > 0 ? (
                    <div className="space-y-3">
                      {applications.slice(0, 3).map((application) => (
                        <div key={application.id} className="flex items-center justify-between p-3 bg-[#A3D958]/5 rounded-lg hover:bg-[#A3D958]/10 transition-all duration-300">
                          <div className="flex-1">
                            <h4 className="font-medium text-[#222327]">{application.job?.title}</h4>
                            <p className="text-sm text-[#2D3559]">{application.job?.company}</p>
                            <Badge variant="secondary" className="text-xs bg-[#A3D958]/10 text-[#A3D958]">
                              {application.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#2D3559] text-center py-4">No applications yet. Start applying to jobs!</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Tools Tab */}
          <TabsContent value="ai-tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resume Upload */}
              <ResumeUpload 
                onResumeParsed={(data) => {
                  toast({
                    title: "Resume parsed!",
                    description: "Your resume has been analyzed successfully.",
                  });
                }}
                onFileUploaded={(data) => {
                  toast({
                    title: "File uploaded!",
                    description: "Your file has been uploaded successfully.",
                  });
                }}
              />

              {/* Job Analysis */}
              <JobAnalysis 
                onAnalysisComplete={(data) => {
                  toast({
                    title: "Job analyzed!",
                    description: "Job has been analyzed successfully.",
                  });
                }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resume Generator */}
              <ResumeGenerator 
                currentResume={workHistory}
                jobDescription={jobDescription}
                onResumeGenerated={(data) => {
                  setGeneratedResume(data.content);
                  toast({
                    title: "Resume generated!",
                    description: "Your AI-enhanced resume has been created.",
                  });
                }}
              />

              {/* Cover Letter Generator */}
              <CoverLetterGenerator 
                currentResume={workHistory}
                jobDescription={jobDescription}
                onCoverLetterGenerated={(data) => {
                  setGeneratedCoverLetter(data.content);
                  toast({
                    title: "Cover letter generated!",
                    description: "Your AI-enhanced cover letter has been created.",
                  });
                }}
              />
            </div>

            {/* PDF Exporter */}
            <div className="max-w-2xl mx-auto">
              <PdfExporter 
                content={generatedResume || generatedCoverLetter}
                type={generatedResume ? 'resume' : 'cover_letter'}
                onExportComplete={(data) => {
                  toast({
                    title: "PDF exported!",
                    description: "Your document has been exported successfully.",
                  });
                }}
              />
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-[#222327]">
                  <FileText className="h-5 w-5 text-[#FF7C23]" />
                  <span>Document History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#FF7C23]" />
                  </div>
                ) : files.length > 0 ? (
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-[#FF7C23]/5 rounded-lg hover:bg-[#FF7C23]/10 transition-all duration-300">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-[#FF7C23]" />
                            <div>
                              <h4 className="font-medium text-[#222327]">
                                {file.filename}
                              </h4>
                              <div className="flex items-center space-x-2 text-sm text-[#2D3559]">
                                <span>{file.type}</span>
                                <span>•</span>
                                <span>{(file.fileSize / 1024).toFixed(1)} KB</span>
                                <span>•</span>
                                <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(file.file_url, '_blank')}
                            className="hover:bg-[#FF7C23]/10 hover:text-[#FF7C23] transition-all duration-300"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteFile(file.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#2D3559] text-center py-4">
                    No documents uploaded yet. Upload your first document to see it here.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-[#222327]">
                  <MessageSquare className="h-5 w-5 text-[#2D3559]" />
                  <span>AI Career Assistant</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AIChat />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ApplicantDashboard; 