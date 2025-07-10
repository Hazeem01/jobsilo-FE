import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Link2, 
  FileText, 
  Loader2,
  CheckCircle,
  Copy,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnalyzeJob } from "@/hooks/use-api";
import type { JobAnalysisResponse } from "@/lib/api";

interface JobAnalysisProps {
  onAnalysisComplete?: (analysis: JobAnalysisResponse['data']) => void;
}

const JobAnalysis = ({ onAnalysisComplete }: JobAnalysisProps) => {
  const [jobUrl, setJobUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [analysis, setAnalysis] = useState<JobAnalysisResponse['data'] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { toast } = useToast();
  const analyzeJob = useAnalyzeJob();

  const handleAnalyze = async () => {
    if (!jobUrl && !jobText.trim()) {
      toast({
        title: "Input required",
        description: "Please provide either a job URL or job description text.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      const result = await analyzeJob.mutateAsync({
        jobUrl: jobUrl || undefined,
        jobText: jobText || undefined,
      });

      setAnalysis(result.data);
      onAnalysisComplete?.(result.data);

      toast({
        title: "Analysis complete!",
        description: "Job has been analyzed successfully.",
      });

    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing the job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setJobUrl("");
    setJobText("");
    setAnalysis(null);
  };

  const handleCopyAnalysis = async () => {
    if (analysis?.analysis) {
      try {
        await navigator.clipboard.writeText(analysis.analysis);
        toast({
          title: "Copied!",
          description: "Analysis has been copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Failed to copy analysis to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>AI Job Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-4">
          {/* Job URL Input */}
          <div className="space-y-2">
            <Label htmlFor="job-url">Job URL (Optional)</Label>
            <div className="flex space-x-2">
              <Input
                id="job-url"
                type="url"
                placeholder="https://example.com/job-posting"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setJobUrl("")}
                disabled={!jobUrl}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Job Text Input */}
          <div className="space-y-2">
            <Label htmlFor="job-text">Job Description Text</Label>
            <Textarea
              id="job-text"
              placeholder="Paste the job description here..."
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Provide either a job URL or paste the job description text above
            </p>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!jobUrl && !jobText.trim())}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyze Job
              </>
            )}
          </Button>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Analysis Complete</p>
                <p className="text-xs text-green-600">Job has been analyzed successfully</p>
              </div>
            </div>

            {/* Full Analysis Text */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <h4 className="font-medium text-gray-900">AI Analysis</h4>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAnalysis}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                    {analysis.analysis}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={handleClear}>
                Clear Analysis
              </Button>
              <Button size="sm" className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600">
                <Download className="h-4 w-4 mr-2" />
                Use for Resume
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobAnalysis; 