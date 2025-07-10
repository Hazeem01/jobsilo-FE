import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateJob } from "@/hooks/use-api";

interface JobPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JobPostingModal = ({ isOpen, onClose }: JobPostingModalProps) => {
  const { toast } = useToast();
  const createJob = useCreateJob();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    job_type: "full-time" as 'full-time' | 'part-time' | 'contract' | 'internship',
    salary_range: "select",
    description: "",
    requirements: "",
  });

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
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");

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
    
    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements: skills.length > 0 ? skills : [],
        location: formData.location,
        salary: convertSalaryToApiFormat(formData.salary_range),
        type: formData.job_type,
        status: "active" as const,
      };

      await createJob.mutateAsync(jobData);
      
      toast({
        title: "Job Posted Successfully!",
        description: "Your job posting has been published and is now live.",
      });
      
      // Reset form
      setFormData({
        title: "",
        location: "",
        job_type: "full-time",
        salary_range: "select",
        description: "",
        requirements: "",
      });
      setSkills([]);
      onClose();
    } catch (error) {
      toast({
        title: "Failed to post job",
        description: error instanceof Error ? error.message : "An error occurred while posting the job",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-[#FF7C23] to-[#2D3559] bg-clip-text text-transparent">
            Post New Job
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
              disabled={createJob.isPending}
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
                disabled={createJob.isPending}
              />
            </div>
            
            <div>
              <Label htmlFor="job_type">Job Type *</Label>
              <Select value={formData.job_type} onValueChange={(value) => setFormData({...formData, job_type: value as 'full-time' | 'part-time' | 'contract' | 'internship'})} disabled={createJob.isPending}>
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
              disabled={createJob.isPending}
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
              disabled={createJob.isPending}
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
                disabled={createJob.isPending}
              />
              <Button type="button" onClick={handleAddSkill} variant="outline" disabled={createJob.isPending}>
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
                      disabled={createJob.isPending}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={createJob.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={createJob.isPending}>
              {createJob.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting Job...
                </>
              ) : (
                'Post Job'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobPostingModal;
