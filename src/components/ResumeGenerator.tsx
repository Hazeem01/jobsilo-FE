import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Sparkles, 
  FileText, 
  Loader2,
  CheckCircle,
  Download,
  Copy,
  RefreshCw,
  Settings,
  Target,
  Palette
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGenerateResume } from "@/hooks/use-api";
import type { GeneratedDocumentResponse } from "@/lib/api";

interface ResumeGeneratorProps {
  currentResume?: string;
  jobDescription?: string;
  onResumeGenerated?: (resume: GeneratedDocumentResponse['data']) => void;
}

const ResumeGenerator = ({ currentResume, jobDescription, onResumeGenerated }: ResumeGeneratorProps) => {
  const [resumeContent, setResumeContent] = useState(currentResume || "");
  const [jobDesc, setJobDesc] = useState(jobDescription || "");
  const [preferences, setPreferences] = useState({
    tone: "professional" as "professional" | "creative" | "minimalist",
    focus: [] as string[],
  });
  const [generatedResume, setGeneratedResume] = useState<GeneratedDocumentResponse['data'] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { toast } = useToast();
  const generateResume = useGenerateResume();

  const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "creative", label: "Creative" },
    { value: "minimalist", label: "Minimalist" },
  ];

  const focusOptions = [
    "technical skills",
    "leadership",
    "project experience",
    "problem solving",
    "communication",
    "teamwork",
    "innovation",
    "results-driven",
    "customer focus",
    "analytical thinking",
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
      const result = await generateResume.mutateAsync({
        resume: resumeContent,
        jobDescription: jobDesc,
        preferences: {
          tone: preferences.tone,
          focus: preferences.focus,
        },
      });

      // Transform the API response to match the expected structure
      const transformedData = {
        content: (result.data as any).content || (result.data as any).resume || result.data.content,
        type: (result.data as any).type || 'resume',
        model: (result.data as any).provider || 'openai',
        suggestions: []
      };
      
      setGeneratedResume(transformedData);
      onResumeGenerated?.(transformedData);

      toast({
        title: "Resume generated!",
        description: "Your AI-enhanced resume has been created successfully.",
      });

    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (generatedResume) {
      try {
        await navigator.clipboard.writeText(generatedResume.content);
        toast({
          title: "Copied!",
          description: "Resume content copied to clipboard.",
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
    setGeneratedResume(null);
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
          <Sparkles className="h-5 w-5 text-purple-600" />
          <span>AI Resume Generator</span>
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
              rows={6}
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
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Resume
              </>
            )}
          </Button>
        </div>

        {/* Generated Resume */}
        {generatedResume && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Resume Generated</p>
                <p className="text-xs text-green-600">AI-enhanced resume ready</p>
              </div>
            </div>

            {/* Generated Content */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <h4 className="font-medium text-gray-900">Generated Resume</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {generatedResume.content.split(' ').length} words
                    </Badge>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                    {generatedResume.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            {generatedResume.suggestions && generatedResume.suggestions.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-blue-900">AI Suggestions</h4>
                  </div>
                  <ul className="space-y-1">
                    {generatedResume.suggestions.map((suggestion, index) => (
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

export default ResumeGenerator; 