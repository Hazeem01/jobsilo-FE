import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  FileText, 
  Download, 
  Mail, 
  Brain, 
  ArrowRight, 
  Link2, 
  Loader2,
  Search,
  Briefcase,
  Calendar,
  Star,
  MapPin,
  DollarSign,
  Clock,
  Eye,
  Plus,
  Trash2,
  Edit,
  Copy,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  FileCheck,
  Save,
  History,
  Share2,
  Settings,
  Palette,
  Target,
  Award,
  BookOpen,
  Zap,
  Lightbulb,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Bookmark,
  FolderOpen,
  Layers,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
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
  useUploadFile,
  useDeleteFile,
  useMyApplications,
  useApplyToJob
} from "@/hooks/use-api";
import { AuthModal } from "@/components/AuthModal";
import JobCard from "@/components/JobCard";
import type { Job, Interview, FileInfo } from "@/lib/api";

// Document templates for different industries
const documentTemplates = {
  "Software Engineer": {
    style: "professional",
    tone: "confident",
    focus: ["technical skills", "project experience", "problem solving"],
    keywords: ["React", "TypeScript", "Node.js", "AWS", "Docker"]
  },
  "Marketing Manager": {
    style: "creative",
    tone: "enthusiastic", 
    focus: ["campaign results", "leadership", "brand growth"],
    keywords: ["Digital Marketing", "SEO", "Social Media", "Analytics"]
  },
  "Data Scientist": {
    style: "professional",
    tone: "formal",
    focus: ["analytical skills", "machine learning", "data visualization"],
    keywords: ["Python", "SQL", "TensorFlow", "Tableau", "Statistics"]
  },
  "UX Designer": {
    style: "creative",
    tone: "enthusiastic",
    focus: ["user research", "design thinking", "prototyping"],
    keywords: ["Figma", "Sketch", "User Testing", "Wireframing"]
  },
  "Sales Representative": {
    style: "professional",
    tone: "confident",
    focus: ["sales achievements", "relationship building", "targets"],
    keywords: ["CRM", "Lead Generation", "Negotiation", "Pipeline"]
  }
};

// AI enhancement suggestions
const aiSuggestions = [
  "Add quantifiable achievements to make your resume stand out",
  "Include industry-specific keywords for better ATS optimization",
  "Highlight transferable skills that apply to multiple roles",
  "Use action verbs to describe your responsibilities",
  "Include metrics and percentages to demonstrate impact"
];

const Applicant = () => {
  // State management
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [workHistory, setWorkHistory] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [email, setEmail] = useState("");
  const [generatedResume, setGeneratedResume] = useState("");
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Software Engineer");
  const [resumePreferences, setResumePreferences] = useState({
    tone: "professional" as "professional" | "creative" | "minimalist",
    focus: [] as string[]
  });
  
  // Document management states
  const [documentHistory, setDocumentHistory] = useState<Array<{
    id: string;
    type: 'resume' | 'cover-letter';
    content: string;
    timestamp: string;
    version: number;
  }>>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAIEnhancements, setShowAIEnhancements] = useState(false);
  const [documentNotes, setDocumentNotes] = useState("");
  const [collaborationMode, setCollaborationMode] = useState(false);

  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // API hooks
  const uploadResume = useUploadResume();
  const parseResume = useParseResume();
  const analyzeJob = useAnalyzeJob();
  const generateResume = useGenerateResume();
  const generateCoverLetter = useGenerateCoverLetter();
  const exportResume = useExportResume();
  const proSignup = useProSignup();
  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();
  const myApplications = useMyApplications();
  const applyToJob = useApplyToJob();

  // Data fetching
  const { data: jobsResponse, isLoading: jobsLoading } = useJobs({ status: 'active' });
  const { data: interviewsResponse, isLoading: interviewsLoading } = useApplicantInterviews();
  const { data: filesResponse, isLoading: filesLoading } = useUserFiles();
  const { data: applicationsResponse, isLoading: applicationsLoading } = useMyApplications();

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
    const templateConfig = documentTemplates[template as keyof typeof documentTemplates];
    if (templateConfig) {
      setResumePreferences({
        tone: templateConfig.tone as "professional" | "creative" | "minimalist",
        focus: templateConfig.focus
      });
      setSelectedTemplate(template);
      toast({
        title: "Template applied",
        description: `${template} template has been applied to your preferences.`,
      });
    }
  };

  const handleSaveDocument = (type: 'resume' | 'cover-letter') => {
    const content = type === 'resume' ? generatedResume : generatedCoverLetter;
    if (!content) {
      toast({
        title: "No content to save",
        description: "Please generate a document first.",
        variant: "destructive",
      });
      return;
    }

    const newVersion = {
      id: `${type}-${Date.now()}`,
      type,
      content,
      timestamp: new Date().toISOString(),
      version: documentHistory.filter(d => d.type === type).length + 1
    };

    setDocumentHistory(prev => [...prev, newVersion]);
    toast({
      title: "Document saved",
      description: `Version ${newVersion.version} of your ${type} has been saved.`,
    });
  };

  const handleRestoreVersion = (documentId: string) => {
    const doc = documentHistory.find(d => d.id === documentId);
    if (doc) {
      if (doc.type === 'resume') {
        setGeneratedResume(doc.content);
      } else {
        setGeneratedCoverLetter(doc.content);
      }
      toast({
        title: "Version restored",
        description: `Version ${doc.version} has been restored.`,
      });
    }
  };

  const handleGenerate = async () => {
    if ((!resumeFile && !workHistory) || (!jobDescription && !jobUrl)) {
      toast({
        title: "Missing information",
        description: "Please provide your work history and job details.",
        variant: "destructive",
      });
      return;
    }

    try {
      let resumeData = workHistory;
      
      // If file is uploaded, parse it
      if (resumeFile) {
        try {
          const uploadResult = await uploadResume.mutateAsync({ file: resumeFile, type: 'resume' });
          if (uploadResult.success && uploadResult.data) {
            const parseResult = await parseResume.mutateAsync({ fileId: uploadResult.data.fileId });
            if (parseResult.success && parseResult.data) {
              resumeData = JSON.stringify(parseResult.data.parsedContent);
            }
          }
        } catch (uploadError) {
          console.warn('File upload/parse failed, using manual input:', uploadError);
          // Continue with manual input if file processing fails
        }
      }

      // Analyze job if URL is provided
      let jobAnalysis = null;
      if (jobUrl) {
        try {
          jobAnalysis = await analyzeJob.mutateAsync({ jobUrl });
        } catch (analysisError) {
          console.warn('Job analysis failed:', analysisError);
          // Continue without job analysis
        }
      }

      // Generate resume with preferences
      const resumeResult = await generateResume.mutateAsync({
        resume: resumeData,
        jobDescription: jobDescription || jobUrl,
        preferences: resumePreferences
      });
      
      if (resumeResult.success && resumeResult.data) {
        setGeneratedResume(resumeResult.data.content);
      } else {
        throw new Error('Failed to generate resume');
      }

      // Generate cover letter with preferences
      const coverLetterResult = await generateCoverLetter.mutateAsync({
        resume: resumeData,
        jobDescription: jobDescription || jobUrl,
        preferences: resumePreferences
      });
      
      if (coverLetterResult.success && coverLetterResult.data) {
        setGeneratedCoverLetter(coverLetterResult.data.content);
      } else {
        throw new Error('Failed to generate cover letter');
      }

      toast({
        title: "Documents generated!",
        description: "Your tailored resume and cover letter are ready.",
      });
    } catch (error) {
      console.error('Document generation error:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "An error occurred during generation",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (type: 'resume' | 'cover-letter') => {
    try {
      const content = type === 'resume' ? generatedResume : generatedCoverLetter;
      if (!content) {
        toast({
          title: "No content to export",
          description: "Please generate documents first.",
          variant: "destructive",
        });
        return;
      }

      const result = await exportResume.mutateAsync({ 
        content, 
        type: type === 'resume' ? 'resume' : 'cover_letter', 
        format: 'A4' 
      });

      if (result.success && result.data) {
        // Create download link
        const link = document.createElement('a');
        link.href = result.data.downloadUrl;
        link.download = `tailored-${type}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download started",
          description: `Your ${type.replace('-', ' ')} has been downloaded.`,
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An error occurred during export",
        variant: "destructive",
      });
    }
  };

  const handleProSignup = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email to sign up for Pro.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await proSignup.mutateAsync({ 
        email,
        firstName: "User",
        lastName: "Applicant",
        company: "Individual",
        role: 'applicant'
      });
      if (result.success) {
        toast({
          title: "Thanks for your interest!",
          description: "We'll notify you when Pro features are available.",
        });
        setEmail("");
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error('Pro signup error:', error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An error occurred during signup",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const result = await deleteFile.mutateAsync(fileId);
      if (result.success) {
        toast({
          title: "File deleted",
          description: "The file has been removed successfully.",
        });
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete file error:', error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "An error occurred while deleting the file",
        variant: "destructive",
      });
    }
  };

  const handleApplyToJob = async (jobId: string) => {
    try {
      const result = await applyToJob.mutateAsync({
        jobId,
        resumeUrl: undefined, // Will be added when resume upload is implemented
        coverLetterUrl: undefined // Will be added when cover letter upload is implemented
      });
      
      if (result.success) {
        toast({
          title: "Application submitted!",
          description: "Your application has been successfully submitted.",
        });
      } else {
        throw new Error('Application failed');
      }
    } catch (error) {
      console.error('Application error:', error);
      toast({
        title: "Application failed",
        description: error instanceof Error ? error.message : "An error occurred while submitting your application",
        variant: "destructive",
      });
    }
  };



  const isGenerating = generateResume.isPending || generateCoverLetter.isPending;

  // Filter jobs based on search
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Recruiter
              </h1>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                For Job Seekers
              </Badge>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    Welcome, {user?.firstName}!
                  </span>
                </div>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)} variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )}
              <Link to="/">
                <Button variant="outline" size="sm">
                  <span className="hidden sm:inline">Home</span>
                  <ArrowRight className="h-4 w-4 sm:ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Get Your Dream Job with AI-Powered Applications
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your resume, browse jobs, and let AI create perfectly tailored 
              resumes and cover letters that get you noticed.
            </p>
          </div>

          {/* Main Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="dashboard" className="text-xs sm:text-sm">
                <Briefcase className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="jobs" className="text-xs sm:text-sm">
                <Search className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Browse Jobs</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-xs sm:text-sm">
                <FileText className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Documents</span>
              </TabsTrigger>
              <TabsTrigger value="applications" className="text-xs sm:text-sm">
                <Bookmark className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Applications</span>
              </TabsTrigger>
              <TabsTrigger value="interviews" className="text-xs sm:text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Interviews</span>
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Stats */}
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span>Your Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{files.length}</div>
                        <div className="text-sm text-gray-600">Documents</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{applications.length}</div>
                        <div className="text-sm text-gray-600">Applications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{interviews.length}</div>
                        <div className="text-sm text-gray-600">Interviews</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="h-5 w-5 text-purple-600" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => setActiveTab("documents")}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Create New Document
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("jobs")}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Documents */}
              {files.length > 0 && (
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileCheck className="h-5 w-5 text-green-600" />
                      <span>Recent Documents</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {files.slice(0, 3).map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium text-sm">{file.filename}</div>
                              <div className="text-xs text-gray-500">{file.type}</div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs by title, company, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 backdrop-blur-sm border-white/20"
                  />
                </div>
                <Button 
                  onClick={() => setActiveTab("documents")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Apply to Jobs
                </Button>
              </div>

              {jobsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="relative">
                      <JobCard job={job} />
                      <div className="absolute top-2 right-2">
                        <Button
                          size="sm"
                          onClick={() => handleApplyToJob(job.id)}
                          disabled={applyToJob.isPending}
                          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                        >
                          {applyToJob.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardContent className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600">Try adjusting your search terms or check back later.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              {/* Document Management Header */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Document Center</h3>
                  <p className="text-sm text-gray-600">Create, manage, and enhance your professional documents</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTemplates(!showTemplates)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Templates
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAIEnhancements(!showAIEnhancements)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Enhancements
                  </Button>
                </div>
              </div>

              {/* Templates Panel */}
              {showTemplates && (
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                      <span>Industry Templates</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.keys(documentTemplates).map((template) => (
                        <div
                          key={template}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedTemplate === template
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 bg-white/50 hover:border-purple-300'
                          }`}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <Award className="h-4 w-4 text-purple-600" />
                            <h4 className="font-medium text-sm">{template}</h4>
                          </div>
                          <p className="text-xs text-gray-600">
                            {documentTemplates[template as keyof typeof documentTemplates].focus.join(', ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Enhancements Panel */}
              {showAIEnhancements && (
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-green-600" />
                      <span>AI Enhancement Suggestions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aiSuggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <Lightbulb className="h-4 w-4 text-green-600 mt-0.5" />
                          <p className="text-sm text-gray-700">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-6">
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span>Your Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Tabs defaultValue="upload" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-2 bg-white/50">
                          <TabsTrigger value="upload">Upload Resume</TabsTrigger>
                          <TabsTrigger value="manual">Enter Manually</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="upload" className="space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              Drop your resume here or click to browse
                            </p>
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx,.txt"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="resume-upload"
                            />
                            <Label htmlFor="resume-upload" className="cursor-pointer">
                              <Button variant="outline" className="mt-2">
                                Choose File
                              </Button>
                            </Label>
                            {resumeFile && (
                              <p className="text-sm text-green-600 mt-2">
                                ✓ {resumeFile.name}
                              </p>
                            )}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="manual" className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="work-history">Work History & Skills</Label>
                            <Textarea
                              id="work-history"
                              placeholder="Describe your work experience, skills, and achievements..."
                              value={workHistory}
                              onChange={(e) => setWorkHistory(e.target.value)}
                              rows={6}
                              className="bg-white/50 backdrop-blur-sm border-white/20"
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Link2 className="h-5 w-5 text-purple-600" />
                        <span>Job Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="job-url">Job URL (Optional)</Label>
                        <Input
                          id="job-url"
                          type="url"
                          placeholder="https://example.com/job-posting"
                          value={jobUrl}
                          onChange={(e) => setJobUrl(e.target.value)}
                          className="bg-white/50 backdrop-blur-sm border-white/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="job-description">Job Description</Label>
                        <Textarea
                          id="job-description"
                          placeholder="Paste the job description here..."
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          rows={6}
                          className="bg-white/50 backdrop-blur-sm border-white/20"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Brain className="h-5 w-5 text-green-600" />
                        <span>AI Preferences</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Style</Label>
                          <select
                            value={resumePreferences.tone}
                            onChange={(e) => setResumePreferences(prev => ({
                              ...prev,
                              tone: e.target.value as "professional" | "creative" | "minimalist"
                            }))}
                            className="w-full p-2 border rounded-md bg-white/50 backdrop-blur-sm border-white/20"
                          >
                            <option value="professional">Professional</option>
                            <option value="creative">Creative</option>
                            <option value="minimalist">Minimalist</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Focus Areas</Label>
                        <div className="flex flex-wrap gap-2">
                          {resumePreferences.focus.map((focus, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {focus}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Documents...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Generate Documents
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCollaborationMode(!collaborationMode)}
                      className={collaborationMode ? "bg-green-100 border-green-300" : ""}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Output Section */}
                <div className="space-y-6">
                  {/* Document History */}
                  {documentHistory.length > 0 && (
                    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <History className="h-5 w-5 text-blue-600" />
                          <span>Document History</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {documentHistory.slice(-3).map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-2 bg-white/50 rounded">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-3 w-3 text-blue-600" />
                                <span className="text-xs font-medium">{doc.type}</span>
                                <span className="text-xs text-gray-500">v{doc.version}</span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRestoreVersion(doc.id)}
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        <span>Generated Resume</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                          {generatedResume || "Your tailored resume will appear here..."}
                        </pre>
                      </div>
                      {generatedResume && (
                        <div className="flex gap-2 mt-4">
                          <Button 
                            onClick={() => handleExport('resume')}
                            variant="outline" 
                            className="flex-1"
                            disabled={exportResume.isPending}
                          >
                            {exportResume.isPending ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4 mr-2" />
                            )}
                            Export PDF
                          </Button>
                          <Button
                            onClick={() => handleSaveDocument('resume')}
                            variant="outline"
                            size="sm"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <span>Generated Cover Letter</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                          {generatedCoverLetter || "Your tailored cover letter will appear here..."}
                        </pre>
                      </div>
                      {generatedCoverLetter && (
                        <div className="flex gap-2 mt-4">
                          <Button 
                            onClick={() => handleExport('cover-letter')}
                            variant="outline" 
                            className="flex-1"
                            disabled={exportResume.isPending}
                          >
                            {exportResume.isPending ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4 mr-2" />
                            )}
                            Export PDF
                          </Button>
                          <Button
                            onClick={() => handleSaveDocument('cover-letter')}
                            variant="outline"
                            size="sm"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Collaboration Notes */}
                  {collaborationMode && (
                    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <MessageSquare className="h-5 w-5 text-purple-600" />
                          <span>Collaboration Notes</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Add notes for collaboration or feedback..."
                          value={documentNotes}
                          onChange={(e) => setDocumentNotes(e.target.value)}
                          rows={3}
                          className="bg-white/50 backdrop-blur-sm border-white/20"
                        />
                      </CardContent>
                    </Card>
                  )}

                  {/* Pro Signup */}
                  <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Brain className="h-5 w-5 text-purple-600" />
                        <span>Upgrade to Pro</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Get unlimited AI generations, priority processing, and advanced features.
                      </p>
                      <div className="space-y-2">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/50 backdrop-blur-sm border-white/20"
                        />
                        <Button 
                          onClick={handleProSignup}
                          disabled={proSignup.isPending}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                          {proSignup.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Brain className="h-4 w-4 mr-2" />
                          )}
                          Get Pro Access
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-6">
              {/* Applications Content */}
              {applicationsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : applications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {applications.map((application) => (
                    <Card key={application.id} className="bg-white/60 backdrop-blur-sm border-white/20">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                          <span>Application</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant={application.status === 'applied' ? 'default' : application.status === 'interviewed' ? 'secondary' : 'destructive'}>
                            {application.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                                                   <div className="flex items-center space-x-2">
                           <Clock className="h-4 w-4 text-gray-500" />
                           <span>{new Date(application.appliedAt).toLocaleDateString()}</span>
                         </div>
                         <div className="flex items-center space-x-2">
                           <MapPin className="h-4 w-4 text-gray-500" />
                           <span>{application.job.title}</span>
                         </div>
                         <div className="flex items-center space-x-2">
                           <Briefcase className="h-4 w-4 text-gray-500" />
                           <span>{application.job.company}</span>
                         </div>
                       </div>
                       </CardContent>
                     </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardContent className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
                    <p className="text-gray-600">Your job applications will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Interviews Tab */}
            <TabsContent value="interviews" className="space-y-6">
              {interviewsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : interviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {interviews.map((interview) => (
                    <Card key={interview.id} className="bg-white/60 backdrop-blur-sm border-white/20">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <span>Interview</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant={interview.status === 'scheduled' ? 'default' : 'secondary'}>
                            {interview.status}
                          </Badge>
                          <Badge variant="outline">
                            {interview.type}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{new Date(interview.scheduled_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{interview.duration} minutes</span>
                          </div>
                        </div>
                        {interview.notes && (
                          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {interview.notes}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No interviews scheduled</h3>
                    <p className="text-gray-600">Your upcoming interviews will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Applicant;