import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type {
  ProSignupData
} from '@/lib/api';

// Dashboard Queries
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiClient.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useJobs = (params?: {
  status?: 'active' | 'draft' | 'closed';
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => apiClient.getJobs(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCandidates = (params?: {
  status?: 'applied' | 'reviewing' | 'interviewed' | 'hired' | 'rejected';
  jobId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['candidates', params],
    queryFn: () => apiClient.getCandidates(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Job Mutations
export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobData: {
      title: string;
      description: string;
      requirements?: string[]; // Backend expects array
      location?: string;
      type?: 'full-time' | 'part-time' | 'contract' | 'internship';
      salary?: string;
      status?: 'active' | 'draft' | 'closed';
    }) => apiClient.createJob(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: {
        title?: string;
        description?: string;
        requirements?: string[];
        location?: string;
        salary?: string;
        type?: 'full-time' | 'part-time' | 'contract' | 'internship';
        status?: 'active' | 'draft' | 'closed';
      };
    }) => apiClient.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
};

export const useUpdateCandidateStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: {
        status: 'applied' | 'reviewing' | 'interviewed' | 'hired' | 'rejected';
        notes?: string;
        rating?: number;
      };
    }) => apiClient.updateCandidateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
};

// Applicant Features
export const useUploadResume = () => {
  return useMutation({
    mutationFn: ({ file, type }: { 
      file: File; 
      type?: 'resume' | 'cover_letter';
    }) => apiClient.uploadResume(file, type),
  });
};

export const useParseResume = () => {
  return useMutation({
    mutationFn: ({ fileId }: { fileId: string }) => apiClient.parseResume(fileId),
  });
};

export const useAnalyzeJob = () => {
  return useMutation({
    mutationFn: (data: {
      jobUrl?: string;
      jobText?: string;
    }) => apiClient.analyzeJob(data),
  });
};

export const useGenerateResume = () => {
  return useMutation({
    mutationFn: (data: {
      resume: string;
      jobDescription: string;
      preferences?: {
        tone?: 'professional' | 'creative' | 'minimalist';
        focus?: string[];
      };
    }) => apiClient.generateResume(data),
  });
};

export const useGenerateCoverLetter = () => {
  return useMutation({
    mutationFn: (data: {
      resume: string;
      jobDescription: string;
      preferences?: {
        tone?: 'professional' | 'creative' | 'minimalist';
        focus?: string[];
      };
    }) => apiClient.generateCoverLetter(data),
  });
};

export const useExportResume = () => {
  return useMutation({
    mutationFn: ({ content, type, format }: { 
      content: string; 
      type?: 'resume' | 'cover_letter';
      format?: 'A4';
    }) => apiClient.exportResume(content, type, format),
  });
};

export const useProSignup = () => {
  return useMutation({
    mutationFn: (data: {
      email: string;
      firstName: string;
      lastName: string;
      company: string;
      role: 'applicant';
    }) => apiClient.proSignup(data),
  });
};

export const useApplicantInterviews = (params?: {
  status?: 'scheduled' | 'completed' | 'cancelled';
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['applicant', 'interviews', params],
    queryFn: () => apiClient.getInterviews(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Applicant job application hooks
export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (applicationData: {
      jobId: string;
      resumeUrl?: string;
      coverLetterUrl?: string;
    }) => apiClient.applyToJob(applicationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicant', 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useMyApplications = (params?: {
  status?: 'applied' | 'reviewing' | 'interviewing' | 'offered' | 'rejected';
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['applicant', 'applications', params],
    queryFn: () => apiClient.getMyApplications(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};



// Chat Features
export const useChatHistory = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['chat', 'history', params],
    queryFn: () => apiClient.getChatHistory(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useSendChatMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ message, context }: { 
      message: string; 
      context?: string;
    }) => apiClient.sendChatMessage(message, context),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'history'] });
    },
  });
};

export const useChatSuggestions = (context?: string) => {
  return useQuery({
    queryKey: ['chat', 'suggestions', context],
    queryFn: () => apiClient.getChatSuggestions(context),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// File Management
export const useUploadFile = () => {
  return useMutation({
    mutationFn: ({ file, type, description }: { 
      file: File; 
      type: 'resume' | 'cover_letter' | 'document';
      description?: string;
    }) => apiClient.uploadFile(file, type, description),
  });
};

export const useFileInfo = (id: string) => {
  return useQuery({
    queryKey: ['files', id],
    queryFn: () => apiClient.getFileInfo(id),
    enabled: !!id,
  });
};

export const useUserFiles = (params?: {
  type?: 'resume' | 'cover_letter' | 'document';
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['files', 'user', params],
    queryFn: () => apiClient.getUserFiles(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', 'user'] });
    },
  });
};

// Company Management
export const useCompanies = (params?: {
  search?: string;
  industry?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => apiClient.getCompanies(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: () => apiClient.getCompany(id),
    enabled: !!id,
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      apiClient.updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useCompanyUsers = (id: string, params?: {
  role?: 'recruiter' | 'applicant';
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['companies', id, 'users', params],
    queryFn: () => apiClient.getCompanyUsers(id, params),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Analytics
export const useApiAnalytics = (params?: {
  period?: 'day' | 'week' | 'month';
  endpoint?: string;
}) => {
  return useQuery({
    queryKey: ['analytics', 'api', params],
    queryFn: () => apiClient.getApiAnalytics(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRateLimitAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'rate-limits'],
    queryFn: () => apiClient.getRateLimitAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useHealthAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'health'],
    queryFn: () => apiClient.getHealthAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// System
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.healthCheck(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useApiInfo = () => {
  return useQuery({
    queryKey: ['api', 'info'],
    queryFn: () => apiClient.getApiInfo(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}; 