import config from '@/config';

// API Configuration
const API_BASE_URL = 'http://localhost:3001/api/v1';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'recruiter' | 'applicant' | 'admin';
  companyId?: string;
  createdAt: string;
}

export interface Company {
  id?: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: 'small' | 'medium' | 'large';
  location?: string;
  foundedYear?: number;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface Job {
  id: string;
  recruiter_id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string; // Backend returns as JSON string
  salary_range: string | null;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship' | null;
  status: 'active' | 'draft' | 'closed';
  created_at: string;
  updated_at: string;
  company_id: string | null;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'applied' | 'reviewing' | 'interviewed' | 'hired' | 'rejected';
  notes?: string;
  rating?: number;
  created_at: string;
}

export interface CandidateDetails extends Candidate {
  resume: Resume;
  interviews: Interview[];
}

export interface Resume {
  id: string;
  user_id: string;
  file_id: string;
  parsed_content: ParsedResume;
  created_at: string;
}

export interface ParsedResume {
  extractedText: string;
  sections: {
    contact: {
      name: string;
      email: string;
      phone?: string;
    };
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
    }>;
    skills: string[];
  };
}

export interface Interview {
  id: string;
  candidate_id: string;
  job_id: string;
  scheduled_at: string;
  duration: number;
  type: 'video' | 'phone' | 'onsite';
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface ResumeUploadResponse {
  success: boolean;
  data: {
    fileId: string;
    filename: string;
    fileUrl: string;
    fileSize: number;
  };
}

export interface ResumeParseResponse {
  success: boolean;
  data: {
    resumeId: string;
    parsedContent: ParsedResume;
  };
}

export interface JobAnalysisResponse {
  success: boolean;
  data: {
    analysis: {
      keySkills: string[];
      experienceLevel: string;
      industry: string;
      salaryRange: string;
      growthOpportunities: string[];
      requiredQualifications: string[];
      preferredQualifications: string[];
    };
  };
}

export interface GeneratedContent {
  content: string;
  type: string;
  model: string;
}

export interface GeneratedDocumentResponse {
  success: boolean;
  data: GeneratedContent;
}

export interface PdfExportResponse {
  success: boolean;
  data: {
    pdfBase64: string;
    downloadUrl: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatResponse {
  success: boolean;
  data: {
    message: string;
    context: string;
    timestamp: string;
  };
}

export interface ChatHistoryResponse {
  success: boolean;
  data: {
    conversations: ChatMessage[][];
    totalMessages: number;
    context: string;
  };
}

export interface ChatSuggestionsResponse {
  success: boolean;
  data: {
    suggestions: string[];
  };
}

export interface FileInfo {
  id: string;
  user_id: string;
  filename: string;
  file_path: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  type: 'resume' | 'cover_letter' | 'document';
  description?: string;
  created_at: string;
}

export interface FileUploadResponse {
  success: boolean;
  data: {
    fileId: string;
    filename: string;
    fileUrl: string;
    fileSize: number;
    type: string;
    mimeType: string;
  };
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface JobsResponse {
  success: boolean;
  data: {
    jobs: Job[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalJobs: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface CandidatesResponse {
  success: boolean;
  data: {
    candidates: Candidate[];
    pagination: Pagination;
  };
}

export interface InterviewsResponse {
  success: boolean;
  data: {
    interviews: Interview[];
    pagination: Pagination;
  };
}

export interface UserFilesResponse {
  success: boolean;
  data: {
    files: FileInfo[];
    pagination: Pagination;
  };
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalCandidates: number;
  interviewsScheduled: number;
  hiresThisMonth: number;
  averageTimeToHire: number;
}

export interface ProSignupData {
  plan: 'monthly' | 'yearly';
  paymentMethod: string;
}

export interface AnalyticsResponse {
  success: boolean;
  data: {
    period: string;
    endpoint: string;
    requestCount: number;
    averageResponseTime: number;
    errorRate: number;
  };
}

export interface HealthResponse {
  success: boolean;
  data: {
    status: string;
    timestamp: string;
    uptime: number;
    environment: string;
  };
}

export interface ApiInfoResponse {
  success: boolean;
  data: {
    message: string;
    version: string;
    endpoints: {
      auth: string;
      dashboard: string;
      applicant: string;
      chat: string;
      files: string;
      companies: string;
      docs: string;
      health: string;
    };
    documentation: string;
  };
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Authorization header if token exists
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication Methods
  async register(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    role: 'recruiter' | 'applicant' = 'applicant',
    company?: Company
  ): Promise<AuthResponse> {
    const payload: any = {
      email,
      password,
      firstName,
      lastName,
      role,
    };

    if (role === 'recruiter' && company) {
      payload.company = company;
    }

    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<{ success: boolean; data: { message: string } }> {
    return this.request<{ success: boolean; data: { message: string } }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<{ success: boolean; data: { user: User } }> {
    return this.request<{ success: boolean; data: { user: User } }>('/auth/me');
  }

  // Dashboard Methods
  async getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
    return this.request<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
  }

  async getJobs(params?: {
    status?: 'active' | 'draft' | 'closed';
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<JobsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/dashboard/jobs${queryString ? `?${queryString}` : ''}`;
    
    return this.request<JobsResponse>(endpoint);
  }

  async createJob(jobData: {
    title: string;
    description: string;
    requirements?: string[]; // Backend expects array
    location?: string;
    type?: 'full-time' | 'part-time' | 'contract' | 'internship';
    salary?: string;
    status?: 'active' | 'draft' | 'closed';
  }): Promise<{ success: boolean; data: Job }> {
    return this.request<{ success: boolean; data: Job }>('/dashboard/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(id: string, jobData: {
    title?: string;
    description?: string;
    requirements?: string[];
    location?: string;
    salary?: string;
    type?: 'full-time' | 'part-time' | 'contract' | 'internship';
    status?: 'active' | 'draft' | 'closed';
  }): Promise<{ success: boolean; data: Job }> {
    return this.request<{ success: boolean; data: Job }>(`/dashboard/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(id: string): Promise<{ success: boolean; data: { message: string } }> {
    return this.request<{ success: boolean; data: { message: string } }>(`/dashboard/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async getCandidates(params?: {
    status?: 'applied' | 'reviewing' | 'interviewed' | 'hired' | 'rejected';
    jobId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<CandidatesResponse> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.jobId) searchParams.append('jobId', params.jobId);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/dashboard/candidates${queryString ? `?${queryString}` : ''}`;
    
    return this.request<CandidatesResponse>(endpoint);
  }

  async updateCandidateStatus(id: string, data: {
    status: 'applied' | 'reviewing' | 'interviewed' | 'hired' | 'rejected';
    notes?: string;
    rating?: number;
  }): Promise<{ success: boolean; data: Candidate }> {
    return this.request<{ success: boolean; data: Candidate }>(`/dashboard/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Applicant Methods
  async uploadResume(file: File, type: 'resume' | 'cover_letter' = 'resume'): Promise<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request<ResumeUploadResponse>('/applicant/resumes/upload', {
      method: 'POST',
      headers: {
        // Remove Content-Type to let browser set it with boundary
      },
      body: formData,
    });
  }

  async parseResume(fileId: string): Promise<ResumeParseResponse> {
    return this.request<ResumeParseResponse>('/applicant/resumes/parse', {
      method: 'POST',
      body: JSON.stringify({ fileId }),
    });
  }

  async analyzeJob(data: {
    jobUrl?: string;
    jobText?: string;
  }): Promise<JobAnalysisResponse> {
    return this.request<JobAnalysisResponse>('/applicant/ai/analyze-job', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateResume(data: {
    resume: string;
    jobDescription: string;
    preferences?: {
      tone?: 'professional' | 'creative' | 'minimalist';
      focus?: string[];
    };
  }): Promise<GeneratedDocumentResponse> {
    return this.request<GeneratedDocumentResponse>('/applicant/ai/generate-resume', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateCoverLetter(data: {
    resume: string;
    jobDescription: string;
    preferences?: {
      tone?: 'professional' | 'creative' | 'minimalist';
      focus?: string[];
    };
  }): Promise<GeneratedDocumentResponse> {
    return this.request<GeneratedDocumentResponse>('/applicant/ai/generate-cover-letter', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async exportResume(content: string, type: 'resume' | 'cover_letter' = 'resume', format: 'A4' = 'A4'): Promise<PdfExportResponse> {
    return this.request<PdfExportResponse>('/applicant/export/resume', {
      method: 'POST',
      body: JSON.stringify({ content, type, format }),
    });
  }

  async getInterviews(params?: {
    status?: 'scheduled' | 'completed' | 'cancelled';
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: { interviews: Interview[]; pagination: Pagination } }> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/applicant/interviews${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ success: boolean; data: { interviews: Interview[]; pagination: Pagination } }>(endpoint);
  }

  async proSignup(data: {
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    role: 'applicant';
  }): Promise<{ success: boolean; data: { message: string } }> {
    return this.request<{ success: boolean; data: { message: string } }>('/applicant/pro/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Applicant job application methods
  async applyToJob(applicationData: {
    jobId: string;
    resumeUrl?: string;
    coverLetterUrl?: string;
  }): Promise<{ 
    success: boolean; 
    data: {
      applicationId: string;
      status: string;
      appliedAt: string;
      job: {
        id: string;
        title: string;
        company: string;
        location: string;
      };
    };
  }> {
    return this.request<{ 
      success: boolean; 
      data: {
        applicationId: string;
        status: string;
        appliedAt: string;
        job: {
          id: string;
          title: string;
          company: string;
          location: string;
        };
      };
    }>('/applicant/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async getMyApplications(params?: {
    status?: 'applied' | 'reviewing' | 'interviewing' | 'offered' | 'rejected';
    page?: number;
    limit?: number;
  }): Promise<{ 
    success: boolean; 
    data: {
      applications: Array<{
        id: string;
        status: string;
        appliedAt: string;
        updatedAt: string;
        resumeUrl?: string;
        coverLetterUrl?: string;
        job: {
          id: string;
          title: string;
          company: string;
          location: string;
          jobType: string;
          salaryRange: string;
          status: string;
        };
      }>;
      pagination: Pagination;
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/applicant/applications${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ 
      success: boolean; 
      data: {
        applications: Array<{
          id: string;
          status: string;
          appliedAt: string;
          updatedAt: string;
          resumeUrl?: string;
          coverLetterUrl?: string;
          job: {
            id: string;
            title: string;
            company: string;
            location: string;
            jobType: string;
            salaryRange: string;
            status: string;
          };
        }>;
        pagination: Pagination;
      };
    }>(endpoint);
  }

  // Chat Methods
  async sendChatMessage(message: string, context?: string): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  async getChatHistory(params?: {
    page?: number;
    limit?: number;
  }): Promise<ChatHistoryResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/chat/history${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ChatHistoryResponse>(endpoint);
  }

  async getChatSuggestions(context?: string): Promise<ChatSuggestionsResponse> {
    const searchParams = new URLSearchParams();
    if (context) searchParams.append('context', context);

    const queryString = searchParams.toString();
    const endpoint = `/chat/suggestions${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ChatSuggestionsResponse>(endpoint);
  }

  // File Management Methods
  async uploadFile(file: File, type: 'resume' | 'cover_letter' | 'document', description?: string): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (description) formData.append('description', description);

    return this.request<FileUploadResponse>('/files/upload', {
      method: 'POST',
      headers: {
        // Remove Content-Type to let browser set it with boundary
      },
      body: formData,
    });
  }

  async getFileInfo(id: string): Promise<{ success: boolean; data: FileInfo }> {
    return this.request<{ success: boolean; data: FileInfo }>(`/files/${id}`);
  }

  async downloadFile(id: string): Promise<Blob> {
    const url = `${this.baseUrl}/files/${id}/download`;
    const headers: HeadersInit = {};
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    return response.blob();
  }

  async deleteFile(id: string): Promise<{ success: boolean; data: { message: string } }> {
    return this.request<{ success: boolean; data: { message: string } }>(`/files/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserFiles(params?: {
    type?: 'resume' | 'cover_letter' | 'document';
    page?: number;
    limit?: number;
  }): Promise<UserFilesResponse> {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.append('type', params.type);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/files/user/files${queryString ? `?${queryString}` : ''}`;
    
    return this.request<UserFilesResponse>(endpoint);
  }

  // Company Management Methods
  async getCompanies(params?: {
    search?: string;
    industry?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: { companies: Company[]; pagination: Pagination } }> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.industry) searchParams.append('industry', params.industry);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/companies${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ success: boolean; data: { companies: Company[]; pagination: Pagination } }>(endpoint);
  }

  async getCompany(id: string): Promise<{ success: boolean; data: Company }> {
    return this.request<{ success: boolean; data: Company }>(`/companies/${id}`);
  }

  async updateCompany(id: string, companyData: Partial<Company>): Promise<{ success: boolean; data: Company }> {
    return this.request<{ success: boolean; data: Company }>(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  }

  async getCompanyUsers(id: string, params?: {
    role?: 'recruiter' | 'applicant';
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: { users: User[]; pagination: Pagination } }> {
    const searchParams = new URLSearchParams();
    if (params?.role) searchParams.append('role', params.role);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/companies/${id}/users${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ success: boolean; data: { users: User[]; pagination: Pagination } }>(endpoint);
  }

  // Analytics Methods
  async getApiAnalytics(params?: {
    period?: 'day' | 'week' | 'month';
    endpoint?: string;
  }): Promise<AnalyticsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append('period', params.period);
    if (params?.endpoint) searchParams.append('endpoint', params.endpoint);

    const queryString = searchParams.toString();
    const endpoint = `/analytics/api${queryString ? `?${queryString}` : ''}`;
    
    return this.request<AnalyticsResponse>(endpoint);
  }

  async getRateLimitAnalytics(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/analytics/rate-limits');
  }

  async getHealthAnalytics(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/analytics/health');
  }

  // System Methods
  async healthCheck(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  async getApiInfo(): Promise<ApiInfoResponse> {
    return this.request<ApiInfoResponse>('/');
  }

  // Token Management
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
    console.log('🔐 Token saved:', token ? 'Present' : 'Missing');
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
    console.log('🔐 Token cleared');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  hasValidToken(): boolean {
    return !!this.token;
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient; 