import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, FileText, Download, Mail, Brain, ArrowRight, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Applicant = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [workHistory, setWorkHistory] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [email, setEmail] = useState("");
  const [generatedResume, setGeneratedResume] = useState("");
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

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

  const handleGenerate = async () => {
    if ((!resumeFile && !workHistory) || (!jobDescription && !jobUrl)) {
      toast({
        title: "Missing information",
        description: "Please provide your work history and job details.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedResume(`
TAILORED RESUME

John Doe
Software Developer | React & Node.js Specialist

SUMMARY
Experienced full-stack developer with 5+ years building scalable web applications. 
Specialized in React, Node.js, and modern JavaScript frameworks.

EXPERIENCE
Senior Frontend Developer - TechCorp (2022-2024)
• Built responsive React applications serving 100k+ users
• Implemented TypeScript for improved code quality
• Collaborated with cross-functional teams using Agile methodology

Frontend Developer - StartupXYZ (2020-2022)
• Developed user interfaces using React and Tailwind CSS
• Optimized application performance resulting in 40% faster load times
• Mentored junior developers and conducted code reviews

SKILLS
• Frontend: React, TypeScript, Tailwind CSS, Next.js
• Backend: Node.js, Express, PostgreSQL
• Tools: Git, Docker, AWS, Jest

EDUCATION
Bachelor of Computer Science - State University (2016-2020)
      `);

      setGeneratedCoverLetter(`
Dear Hiring Manager,

I am writing to express my strong interest in the Frontend Developer position at your company. With over 5 years of experience in React and modern web development, I am excited about the opportunity to contribute to your team.

In my current role at TechCorp, I have successfully built and maintained React applications that serve over 100,000 users daily. My expertise in TypeScript and component architecture aligns perfectly with your requirements for scalable, maintainable code.

What particularly excites me about this role is the opportunity to work with cutting-edge technologies and contribute to a product that makes a real impact. My experience with Tailwind CSS and responsive design would allow me to hit the ground running and deliver high-quality user experiences from day one.

I would welcome the opportunity to discuss how my skills and passion for frontend development can contribute to your team's success.

Best regards,
John Doe
      `);
      
      setIsGenerating(false);
      toast({
        title: "Documents generated!",
        description: "Your tailored resume and cover letter are ready.",
      });
    }, 2000);
  };

  const handleExport = (type: 'resume' | 'cover-letter') => {
    const content = type === 'resume' ? generatedResume : generatedCoverLetter;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tailored-${type}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: `Your ${type.replace('-', ' ')} has been downloaded.`,
    });
  };

  const handleProSignup = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email to sign up for Pro.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thanks for your interest!",
      description: "We'll notify you when Pro features are available.",
    });
    setEmail("");
  };

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
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                For Job Seekers
              </Badge>
            </div>
            <Link to="/">
              <Button variant="outline">
                Recruiter Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get Your Dream Job with AI-Powered Applications
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your resume, paste a job description, and let AI create perfectly tailored 
              resumes and cover letters that get you noticed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                          className="w-full"
                        />
                        {resumeFile && (
                          <Badge variant="outline" className="mt-2">
                            {resumeFile.name}
                          </Badge>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="manual" className="space-y-4">
                      <div>
                        <Label htmlFor="work-history">Work History & Skills</Label>
                        <Textarea
                          id="work-history"
                          placeholder="Enter your work experience, skills, education, and achievements..."
                          value={workHistory}
                          onChange={(e) => setWorkHistory(e.target.value)}
                          className="min-h-32 bg-white/50"
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
                  <div>
                    <Label htmlFor="job-url">Job Post URL (Optional)</Label>
                    <Input
                      id="job-url"
                      placeholder="https://company.com/careers/job-id"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      className="bg-white/50"
                    />
                  </div>
                  
                  <div className="text-center">
                    <span className="text-sm text-gray-500">OR</span>
                  </div>
                  
                  <div>
                    <Label htmlFor="job-description">Job Description</Label>
                    <Textarea
                      id="job-description"
                      placeholder="Paste the job description, requirements, and company information..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="min-h-32 bg-white/50"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Brain className="h-4 w-4 mr-2 animate-pulse" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate Tailored Documents
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              {(generatedResume || generatedCoverLetter) && (
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        <span>Generated Documents</span>
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        AI Generated
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="resume" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-2 bg-white/50">
                        <TabsTrigger value="resume">Tailored Resume</TabsTrigger>
                        <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="resume" className="space-y-4">
                        {generatedResume && (
                          <>
                            <div className="bg-white p-4 rounded-lg border text-sm whitespace-pre-line max-h-96 overflow-y-auto">
                              {generatedResume}
                            </div>
                            <Button 
                              onClick={() => handleExport('resume')}
                              variant="outline"
                              className="w-full"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Resume
                            </Button>
                          </>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="cover-letter" className="space-y-4">
                        {generatedCoverLetter && (
                          <>
                            <div className="bg-white p-4 rounded-lg border text-sm whitespace-pre-line max-h-96 overflow-y-auto">
                              {generatedCoverLetter}
                            </div>
                            <Button 
                              onClick={() => handleExport('cover-letter')}
                              variant="outline"
                              className="w-full"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Cover Letter
                            </Button>
                          </>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Pro Version Signup */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>Unlock Pro Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Pro Version Includes:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Multiple resume templates</li>
                      <li>• Advanced AI optimization</li>
                      <li>• Job matching scores</li>
                      <li>• Interview preparation</li>
                      <li>• Application tracking</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label htmlFor="email-signup">Get notified when Pro launches</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="email-signup"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/50"
                      />
                      <Button onClick={handleProSignup} variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Notify Me
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicant;