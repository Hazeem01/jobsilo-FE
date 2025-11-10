import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Download,
  Eye,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUploadResume, useParseResume, useUserFiles } from "@/hooks/use-api";
import type { ResumeUploadResponse, ResumeParseResponse } from "@/lib/api";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ResumeUploadProps {
  onResumeParsed?: (parsedData: ResumeParseResponse['data']) => void;
  onFileUploaded?: (uploadData: ResumeUploadResponse['data']) => void;
}

const ResumeUpload = ({ onResumeParsed, onFileUploaded }: ResumeUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<ResumeUploadResponse['data'] | null>(null);
  const [parsedResume, setParsedResume] = useState<ResumeParseResponse['data'] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { data: filesResponse, isLoading: filesLoading } = useUserFiles({ type: 'resume' });
  const files = filesResponse?.data?.files || [];
  const [selectedExistingFileId, setSelectedExistingFileId] = useState<string>("");

  const { toast } = useToast();
  const uploadResume = useUploadResume();
  const parseResume = useParseResume();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, DOCX, or TXT file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setUploadedFile(null);
      setParsedResume(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsProcessing(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadResume.mutateAsync({
        file: selectedFile,
        type: 'resume'
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedFile(result.data);
      onFileUploaded?.(result.data);

      toast({
        title: "Resume uploaded successfully!",
        description: `${selectedFile.name} has been uploaded.`,
      });

      // Auto-parse the resume
      await handleParseResume(result.data.fileId);

    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleParseResume = async (fileId: string) => {
    try {
      setIsProcessing(true);
      const result = await parseResume.mutateAsync({ fileId });
      setParsedResume(result.data);
      onResumeParsed?.(result.data);

      toast({
        title: "Resume parsed successfully!",
        description: "Your resume has been analysed and structured.",
      });

    } catch (error) {
      toast({
        title: "Parsing failed",
        description: "There was an error parsing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadedFile(null);
    setParsedResume(null);
    setUploadProgress(0);
    setShowDetails(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleParseExisting = async () => {
    if (!selectedExistingFileId) return;
    try {
      setIsProcessing(true);
      const result = await parseResume.mutateAsync({ fileId: selectedExistingFileId });
      setParsedResume(result.data);
      onResumeParsed?.(result.data);
      toast({
        title: "Resume parsed successfully!",
        description: "Your resume has been analysed and structured.",
      });
    } catch (error) {
      toast({
        title: "Parsing failed",
        description: "There was an error parsing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-blue-600" />
          <span>Upload Resume</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing resumes dropdown */}
        <div className="space-y-2">
          <Label>Select an already uploaded resume to parse</Label>
          <div className="flex gap-2 items-center">
            <Select value={selectedExistingFileId} onValueChange={setSelectedExistingFileId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder={filesLoading ? 'Loading...' : 'Select a file'} />
              </SelectTrigger>
              <SelectContent>
                {files.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-gray-500">No resumes found</div>
                ) : (
                  files.map(file => (
                    <SelectItem key={file.id} value={file.id}>{file.filename} ({(file.fileSize/1024).toFixed(1)} KB)</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button onClick={handleParseExisting} disabled={!selectedExistingFileId || isProcessing} variant="outline">
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Parse Selected"}
            </Button>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-200 my-4" />
        {/* File Selection */}
        <div className="space-y-2">
          <Label htmlFor="resume-upload">Select Resume File</Label>
          <Input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="cursor-pointer"
          />
          <p className="text-xs text-gray-500">
            Supported formats: PDF, DOC, DOCX, TXT (Max 5MB)
          </p>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Upload Progress */}
        {isProcessing && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && !uploadedFile && (
          <Button
            onClick={handleUpload}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Resume
              </>
            )}
          </Button>
        )}

        {/* Upload Success */}
        {uploadedFile && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Upload Successful</p>
                <p className="text-xs text-green-600">{uploadedFile.filename}</p>
              </div>
            </div>

            {/* Parse Button */}
            {!parsedResume && (
              <Button
                onClick={() => handleParseResume(uploadedFile.fileId)}
                disabled={isProcessing}
                variant="outline"
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Parse Resume
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Parsed Resume Info */}
        {parsedResume && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-800">Resume Parsed</p>
                <p className="text-xs text-purple-600">Content extracted successfully</p>
              </div>
            </div>

            {/* Parsed Content Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="text-center p-2 bg-blue-50 rounded">
                <p className="text-xs font-medium text-blue-800">Contact Info</p>
                <p className="text-xs text-blue-600">✓ Extracted</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="text-xs font-medium text-green-800">Experience</p>
                <p className="text-xs text-green-600">{parsedResume.parsedContent.sections.experience.length} entries</p>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <p className="text-xs font-medium text-purple-800">Skills</p>
                <p className="text-xs text-purple-600">{parsedResume.parsedContent.sections.skills.length} skills</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showDetails ? 'Hide Details' : 'View Details'}
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            {/* Detailed View */}
            {showDetails && parsedResume && (
              <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                {/* Contact Information */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Contact Information</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3 text-gray-500" />
                      <span>{parsedResume.parsedContent.sections.contact.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 text-gray-500" />
                      <span>{parsedResume.parsedContent.sections.contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3 text-gray-500" />
                      <span>{parsedResume.parsedContent.sections.contact.phone}</span>
                    </div>
                    {parsedResume.parsedContent.sections.contact.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span>{parsedResume.parsedContent.sections.contact.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {parsedResume.parsedContent.sections.summary && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>Summary</span>
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {parsedResume.parsedContent.sections.summary}
                    </p>
                  </div>
                )}

                {/* Experience */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Experience ({parsedResume.parsedContent.sections.experience.length} positions)</span>
                  </h4>
                  <div className="space-y-3">
                    {parsedResume.parsedContent.sections.experience.map((exp, index) => (
                      <div key={index} className="p-3 bg-white rounded border">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">{exp.title}</h5>
                          <span className="text-xs text-gray-500">{exp.duration}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{exp.company}</p>
                        {exp.location && (
                          <p className="text-xs text-gray-500 mb-2">{exp.location}</p>
                        )}
                        <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>Education ({parsedResume.parsedContent.sections.education.length} entries)</span>
                  </h4>
                  <div className="space-y-2">
                    {parsedResume.parsedContent.sections.education.map((edu, index) => (
                      <div key={index} className="p-3 bg-white rounded border">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-900">{edu.degree}</h5>
                            <p className="text-sm text-gray-600">{edu.institution}</p>
                          </div>
                          <span className="text-xs text-gray-500">{edu.year}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Code className="h-4 w-4" />
                    <span>Skills ({parsedResume.parsedContent.sections.skills.length} skills)</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {parsedResume.parsedContent.sections.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                {parsedResume.parsedContent.sections.projects && parsedResume.parsedContent.sections.projects.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>Projects ({parsedResume.parsedContent.sections.projects.length} projects)</span>
                    </h4>
                    <div className="space-y-3">
                      {parsedResume.parsedContent.sections.projects.map((project, index) => (
                        <div key={index} className="p-3 bg-white rounded border">
                          <h5 className="font-medium text-gray-900 mb-2">{project.name}</h5>
                          <p className="text-sm text-gray-700 leading-relaxed mb-2">{project.description}</p>
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.map((tech, techIndex) => (
                                <Badge key={techIndex} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUpload; 