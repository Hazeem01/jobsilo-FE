import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, 
  FileText, 
  Loader2,
  CheckCircle,
  Download,
  Copy,
  RefreshCw,
  Settings,
  Target,
  Heart,
  Building
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGenerateCoverLetter } from "@/hooks/use-api";
import type { GeneratedDocumentResponse } from "@/lib/api";

interface CoverLetterGeneratorProps {
  currentResume?: string;
  jobDescription?: string;
  onCoverLetterGenerated?: (coverLetter: GeneratedDocumentResponse['data']) => void;
}

const CoverLetterGenerator = ({ currentResume, jobDescription, onCoverLetterGenerated }: CoverLetterGeneratorProps) => {
  const [resumeContent, setResumeContent] = useState(currentResume || "");
  const [jobDesc, setJobDesc] = useState(jobDescription || "");
  const [companyName, setCompanyName] = useState("");
  const [preferences, setPreferences] = useState({
    tone: "professional" as "professional" | "creative" | "minimalist",
    focus: [] as string[],
  });
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<GeneratedDocumentResponse['data'] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { toast } = useToast();
  const generateCoverLetter = useGenerateCoverLetter();

  const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "creative", label: "Creative" },
    { value: "minimalist", label: "Minimalist" },
  ];

  const focusOptions = [
    "company culture",
    "growth opportunities",
    "technical skills",
    "leadership experience",
    "problem solving",
    "team collaboration",
    "innovation",
    "results-driven",
    "customer focus",
    "learning mindset",
  ];

  const handleGenerate = async () => {
    if (!resumeContent.trim() || !jobDesc.trim()) {
      toast({
        title: "Input required",
        description: "Please provide both resume content and job description.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const result = await generateCoverLetter.mutateAsync({
        resume: resumeContent,
        jobDescription: jobDesc,
        preferences: {
          tone: preferences.tone,
          focus: preferences.focus,
        },
      });

      // Transform the API response to match the expected structure
      const transformedData = {
        content: (result.data as any).coverLetter,
        type: (result.data as any).type,
        model: (result.data as any).provider || 'openai',
        suggestions: []
      };
      
      setGeneratedCoverLetter(transformedData);
      onCoverLetterGenerated?.(transformedData);

      toast({
        title: "Cover letter generated!",
        description: "Your AI-enhanced cover letter has been created successfully.",
      });

    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your cover letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (generatedCoverLetter) {
      try {
        await navigator.clipboard.writeText(generatedCoverLetter.content);
        toast({
          title: "Copied!",
          description: "Cover letter content copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Failed to copy to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRegenerate = () => {
    setGeneratedCoverLetter(null);
  };

  const handleFocusChange = (focus: string) => {
    setPreferences(prev => ({
      ...prev,
      focus: prev.focus.includes(focus)
        ? prev.focus.filter(f => f !== focus)
        : [...prev.focus, focus],
    }));
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-blue-600" />
          <span>AI Cover Letter Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-4">
          {/* Current Resume */}
          <div className="space-y-2">
            <Label htmlFor="resume-content">Current Resume Content</Label>
            <Textarea
              id="resume-content"
              placeholder="Paste your current resume content here..."
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="job-description">Target Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description you're applying for..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name (Optional)</Label>
            <Input
              id="company-name"
              placeholder="Enter the company name..."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-gray-600" />
              <Label className="text-sm font-medium">Generation Preferences</Label>
            </div>

            {/* Tone Selection */}
            <div className="space-y-2">
              <Label htmlFor="tone-select">Tone</Label>
              <Select
                value={preferences.tone}
                onValueChange={(value: "professional" | "creative" | "minimalist") =>
                  setPreferences(prev => ({ ...prev, tone: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Focus Areas */}
            <div className="space-y-2">
              <Label>Focus Areas</Label>
              <div className="flex flex-wrap gap-2">
                {focusOptions.map((focus) => (
                  <Badge
                    key={focus}
                    variant={preferences.focus.includes(focus) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => handleFocusChange(focus)}
                  >
                    {focus}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !resumeContent.trim() || !jobDesc.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Generate Cover Letter
              </>
            )}
          </Button>
        </div>

        {/* Generated Cover Letter */}
        {generatedCoverLetter && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Cover Letter Generated</p>
                <p className="text-xs text-green-600">AI-enhanced cover letter ready</p>
              </div>
            </div>

            {/* Generated Content */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <h4 className="font-medium text-gray-900">Generated Cover Letter</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {generatedCoverLetter.content.split(' ').length} words
                    </Badge>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                    {generatedCoverLetter.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            {generatedCoverLetter.suggestions && generatedCoverLetter.suggestions.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-blue-900">AI Suggestions</h4>
                  </div>
                  <ul className="space-y-1">
                    {generatedCoverLetter.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-blue-800 flex items-start space-x-2">
                        <span className="text-blue-600">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Content
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoverLetterGenerator; 