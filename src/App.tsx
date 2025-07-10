import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RecruiterJobs from "./pages/recruiter/Jobs";
import RecruiterCandidates from "./pages/recruiter/Candidates";
import RecruiterInterviews from "./pages/recruiter/Interviews";
import RecruiterSettings from "./pages/recruiter/Settings";
import ApplicantDashboard from "./pages/applicant/Dashboard";
import ApplicantJobs from "./pages/applicant/Jobs";
import ApplicantApplications from "./pages/applicant/Applications";
import ApplicantSettings from "./pages/applicant/Settings";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminJobs from "./pages/admin/Jobs";
import AdminUsers from "./pages/admin/Users";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route 
              path="/recruiter/dashboard" 
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <Index />
                </ProtectedRoute>
              } 
            />
            {/* Recruiter routes */}
            <Route path="/recruiter/jobs" element={<ProtectedRoute requiredRole="recruiter"><RecruiterJobs /></ProtectedRoute>} />
            <Route path="/recruiter/candidates" element={<ProtectedRoute requiredRole="recruiter"><RecruiterCandidates /></ProtectedRoute>} />
            <Route path="/recruiter/interviews" element={<ProtectedRoute requiredRole="recruiter"><RecruiterInterviews /></ProtectedRoute>} />
            <Route path="/recruiter/settings" element={<ProtectedRoute requiredRole="recruiter"><RecruiterSettings /></ProtectedRoute>} />
            {/* Applicant routes */}
            <Route path="/applicant/dashboard" element={<ProtectedRoute requiredRole="applicant"><ApplicantDashboard /></ProtectedRoute>} />
            <Route path="/applicant/jobs" element={<ProtectedRoute requiredRole="applicant"><ApplicantJobs /></ProtectedRoute>} />
            <Route path="/applicant/applications" element={<ProtectedRoute requiredRole="applicant"><ApplicantApplications /></ProtectedRoute>} />
            <Route path="/applicant/settings" element={<ProtectedRoute requiredRole="applicant"><ApplicantSettings /></ProtectedRoute>} />
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/jobs" element={<ProtectedRoute requiredRole="admin"><AdminJobs /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettings /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
