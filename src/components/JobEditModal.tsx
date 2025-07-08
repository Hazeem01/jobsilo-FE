import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUpdateJob } from "@/hooks/use-api";
import type { Job } from "@/lib/api";

interface JobEditModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to parse requirements JSON string
const parseRequirements = (requirements: string): string[] => {
  try {
    if (!requirements) return [];
    return JSON.parse(requirements);
  } catch (error) {
    console.error('Failed to parse requirements:', error);
    return [];
  }
};

// Helper function to convert salary range back to dropdown value
const convertSalaryToDropdownValue = (salaryRange: string | null): string => {
  if (!salaryRange) return "select";
  if (salaryRange === "Competitive") return "competitive";
  if (salaryRange === "Negotiable") return "negotiable";
  if (salaryRange === "$300,000+") return "300000+";
  
  // Extract numbers from format like "$80,000 - $120,000"
  const match = salaryRange.match(/\$([0-9,]+)\s*-\s*\$([0-9,]+)/);
  if (match) {
    const min = match[1].replace(/,/g, "");
    const max = match[2].replace(/,/g, "");
    return `${min}-${max}`;
  }
  
  return "select";
};

const JobEditModal = ({ job, isOpen, onClose }: JobEditModalProps) => {
  const { toast } = useToast();
  const updateJob = useUpdateJob();
  
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    job_type: "full-time" as 'full-time' | 'part-time' | 'contract' | 'internship',
    salary_range: "select",
    description: "",
    requirements: "",
  });
  
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");

  // Predefined salary ranges
  const salaryRanges = [
    { value: "select", label: "Select salary range" },
    { value: "competitive", label: "Competitive" },
    { value: "negotiable", label: "Negotiable" },
    { value: "30000-50000", label: "$30,000 - $50,000" },
    { value: "40000-60000", label: "$40,000 - $60,000" },
    { value: "50000-75000", label: "$50,000 - $75,000" },
    { value: "60000-90000", label: "$60,000 - $90,000" },
    { value: "75000-100000", label: "$75,000 - $100,000" },
    { value: "80000-120000", label: "$80,000 - $120,000" },
    { value: "100000-150000", label: "$100,000 - $150,000" },
    { value: "120000-180000", label: "$120,000 - $180,000" },
    { value: "150000-200000", label: "$150,000 - $200,000" },
    { value: "200000-300000", label: "$200,000 - $300,000" },
    { value: "300000+", label: "$300,000+" },
  ];

  // Convert salary range string to API format
  const convertSalaryToApiFormat = (salaryRange: string) => {
    if (!salaryRange || salaryRange === "select" || salaryRange === "competitive" || salaryRange === "negotiable") {
      return undefined;
    }
    
    if (salaryRange === "300000+") {
      return "$300,000+";
    }
    
    const [min, max] = salaryRange.split("-").map(num => parseInt(num.replace(/,/g, "")));
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  // Initialize form data when job changes
  useEffect(() => {
    if (job) {
      const requirements = parseRequirements(job.requirements);
      setFormData({
        title: job.title,
        location: job.location,
        job_type: job.job_type || "full-time",
        salary_range: convertSalaryToDropdownValue(job.salary_range),
        description: job.description,
        requirements: "",
      });
      setSkills(requirements);
      setCurrentSkill("");
    }
  }, [job]);

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!job) return;
    
    // Check if any changes were made
    const originalRequirements = parseRequirements(job.requirements);
    const originalSalaryRange = convertSalaryToDropdownValue(job.salary_range);
    
    const hasChanges = 
      formData.title !== job.title ||
      formData.description !== job.description ||
      formData.location !== job.location ||
      formData.job_type !== job.job_type ||
      formData.salary_range !== originalSalaryRange ||
      JSON.stringify(skills.sort()) !== JSON.stringify(originalRequirements.sort());
    
    if (!hasChanges) {
      toast({
        title: "No Changes Made",
        description: "No changes were detected. Please make changes before updating.",
        variant: "destructive",
      });
      return;
    }
    
          try {
        const jobData = {
          title: formData.title,
          description: formData.description,
          requirements: skills.length > 0 ? skills : [],
          location: formData.location,
          salary_range: convertSalaryToApiFormat(formData.salary_range),
          type: formData.job_type,
          status: job.status, // Keep the same status
        };

        await updateJob.mutateAsync({ id: job.id, data: jobData });
      
      toast({
        title: "Job Updated Successfully!",
        description: "Your job posting has been updated and is now live.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Failed to update job",
        description: error instanceof Error ? error.message : "An error occurred while updating the job",
        variant: "destructive",
      });
    }
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Job: {job.title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Senior Frontend Developer"
              required
              disabled={updateJob.isPending}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g. San Francisco, CA or Remote"
                required
                disabled={updateJob.isPending}
              />
            </div>
            
            <div>
              <Label htmlFor="job_type">Job Type *</Label>
              <Select value={formData.job_type} onValueChange={(value) => setFormData({...formData, job_type: value as 'full-time' | 'part-time' | 'contract' | 'internship'})} disabled={updateJob.isPending}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="salary_range">Salary Range</Label>
            <Select 
              value={formData.salary_range} 
              onValueChange={(value) => setFormData({...formData, salary_range: value})}
              disabled={updateJob.isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select salary range" />
              </SelectTrigger>
              <SelectContent>
                {salaryRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              rows={6}
              required
              disabled={updateJob.isPending}
            />
          </div>
          
          <div>
            <Label htmlFor="skills">Required Skills</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="Add a skill..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                disabled={updateJob.isPending}
              />
              <Button type="button" onClick={handleAddSkill} variant="outline" disabled={updateJob.isPending}>
                Add
              </Button>
            </div>
            
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-red-600"
                      disabled={updateJob.isPending}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={updateJob.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateJob.isPending}>
              {updateJob.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Job...
                </>
              ) : (
                'Update Job'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobEditModal; 