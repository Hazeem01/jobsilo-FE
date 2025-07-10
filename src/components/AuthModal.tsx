import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, User, Building2, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { login, register } = useAuth();
  const { toast } = useToast();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerRole, setRegisterRole] = useState<'recruiter' | 'applicant'>('applicant');
  const [registerCompany, setRegisterCompany] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [companySize, setCompanySize] = useState<'small' | 'medium' | 'large'>('medium');
  const [companyLocation, setCompanyLocation] = useState('');
  const [companyFoundedYear, setCompanyFoundedYear] = useState(new Date().getFullYear());

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(loginEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      onClose();
      setLoginEmail('');
      setLoginPassword('');
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to Jobsilo.",
      });
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerFirstName || !registerLastName || !registerEmail || !registerPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(registerEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validatePassword(registerPassword)) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const companyData = registerRole === 'recruiter' && registerCompany ? {
        name: registerCompany,
        description: companyDescription,
        website: companyWebsite,
        industry: companyIndustry,
        size: companySize,
        location: companyLocation,
        foundedYear: companyFoundedYear
      } : undefined;

      await register(
        registerEmail, 
        registerPassword, 
        registerFirstName, 
        registerLastName, 
        registerRole,
        companyData
      );
      onClose();
      
      // Reset form
      setRegisterFirstName('');
      setRegisterLastName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterRole('applicant');
      setRegisterCompany('');
      setCompanyDescription('');
      setCompanyWebsite('');
      setCompanyIndustry('');
      setCompanySize('medium');
      setCompanyLocation('');
      setCompanyFoundedYear(new Date().getFullYear());
      
      toast({
        title: "Account created!",
        description: `Welcome to Jobsilo, ${registerFirstName}!`,
      });
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setLoginEmail('');
    setLoginPassword('');
    setRegisterFirstName('');
    setRegisterLastName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterRole('applicant');
    setRegisterCompany('');
    setCompanyDescription('');
    setCompanyWebsite('');
    setCompanyIndustry('');
    setCompanySize('medium');
    setCompanyLocation('');
    setCompanyFoundedYear(new Date().getFullYear());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md w-full max-w-[95vw] p-6 sm:p-8 rounded-xl shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20 overflow-y-auto max-h-[90vh] sm:max-h-[85vh]">
        <DialogHeader className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-[#FF7C23] to-[#2D3559] rounded-lg">
              <img src="/logo.svg" alt="Jobsilo" className="h-6 w-6" />
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#FF7C23] to-[#2D3559] bg-clip-text text-transparent">
              Welcome to Jobsilo
            </DialogTitle>
          </div>
          <p className="text-sm text-[#2D3559] opacity-80">
            Join thousands of professionals using AI-powered recruitment
          </p>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#F3F8FF] p-1 rounded-lg">
            <TabsTrigger 
              value="login" 
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-[#FF7C23] data-[state=active]:shadow-sm rounded-md py-2.5 px-4 text-sm font-medium transition-all duration-200"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-[#FF7C23] data-[state=active]:shadow-sm rounded-md py-2.5 px-4 text-sm font-medium transition-all duration-200"
            >
              <UserPlus className="h-4 w-4" />
              <span>Sign Up</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm font-medium text-[#222327] flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Address</span>
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-11 border-[#2D3559]/20 focus:border-[#FF7C23] focus:ring-[#FF7C23]/20 text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm font-medium text-[#222327] flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Password</span>
                </Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11 border-[#2D3559]/20 focus:border-[#FF7C23] focus:ring-[#FF7C23]/20 text-sm pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-[#2D3559] hover:text-[#FF7C23]"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-[#FF7C23] to-[#2D3559] hover:from-[#FF7C23] hover:to-[#A3D958] text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="register-first-name" className="text-sm font-medium text-[#222327] flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>First Name</span>
                  </Label>
                  <Input
                    id="register-first-name"
                    type="text"
                    placeholder="First name"
                    value={registerFirstName}
                    onChange={(e) => setRegisterFirstName(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11 border-[#2D3559]/20 focus:border-[#FF7C23] focus:ring-[#FF7C23]/20 text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-last-name" className="text-sm font-medium text-[#222327] flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Last Name</span>
                  </Label>
                  <Input
                    id="register-last-name"
                    type="text"
                    placeholder="Last name"
                    value={registerLastName}
                    onChange={(e) => setRegisterLastName(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11 border-[#2D3559]/20 focus:border-[#FF7C23] focus:ring-[#FF7C23]/20 text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-sm font-medium text-[#222327] flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Address</span>
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-11 border-[#2D3559]/20 focus:border-[#FF7C23] focus:ring-[#FF7C23]/20 text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-sm font-medium text-[#222327] flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Password</span>
                </Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="Create a password (min. 6 characters)"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11 border-[#2D3559]/20 focus:border-[#FF7C23] focus:ring-[#FF7C23]/20 text-sm pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-[#2D3559] hover:text-[#FF7C23]"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-role" className="text-sm font-medium text-[#222327] flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>I am a...</span>
                </Label>
                <Select value={registerRole} onValueChange={(value) => setRegisterRole(value as 'recruiter' | 'applicant')} disabled={isLoading}>
                  <SelectTrigger className="h-11 border-[#2D3559]/20 focus:border-[#FF7C23] focus:ring-[#FF7C23]/20 text-sm">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applicant">Job Seeker</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {registerRole === 'recruiter' && (
                <div className="space-y-4 p-4 bg-[#F3F8FF] rounded-lg border border-[#2D3559]/10">
                  <div className="flex items-center space-x-2 mb-3">
                    <Building2 className="h-4 w-4 text-[#FF7C23]" />
                    <span className="text-sm font-medium text-[#222327]">Company Information</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-company" className="text-sm font-medium text-[#222327]">Company Name</Label>
                    <Input
                      id="register-company"
                      type="text"
                      placeholder="Enter your company name"
                      value={registerCompany}
                      onChange={(e) => setRegisterCompany(e.target.value)}
                      disabled={isLoading}
                      className="h-11 border-[#2D3559]/20 focus:border-[#FF7C23] focus:ring-[#FF7C23]/20 text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-company-description" className="text-sm font-medium text-[#222327]">Company Description</Label>
                    <Input
                      id="register-company-description"
                      type="text"
                      placeholder="Brief description of your company"
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      disabled={isLoading}
                      className="h-11 border-[#2D3559]/20 focus:border-[#FF7C23] focus:ring-[#FF7C23]/20 text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-company-website" className="text-sm font-medium text-[#222327]">Website</Label>
                      <Input
                        id="register-company-website"
                        type="url"
                        placeholder="https://company.com"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        disabled={isLoading}
                        className="h-11 border-[#2D3559]/20 focus:border-[#FF7C23] focus:ring-[#FF7C23]/20 text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-company-industry" className="text-sm font-medium text-[#222327]">Industry</Label>
                      <Input
                        id="register-company-industry"
                        type="text"
                        placeholder="e.g., Technology, Healthcare"
                        value={companyIndustry}
                        onChange={(e) => setCompanyIndustry(e.target.value)}
                        disabled={isLoading}
                        className="h-11 border-[#2D3559]/20 focus:border-[#FF7C23] focus:ring-[#FF7C23]/20 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-company-size" className="text-sm font-medium text-[#222327]">Company Size</Label>
                      <Select value={companySize} onValueChange={(value) => setCompanySize(value as 'small' | 'medium' | 'large')} disabled={isLoading}>
                        <SelectTrigger className="h-11 border-[#2D3559]/20 focus:border-[#FF7C23] focus:ring-[#FF7C23]/20 text-sm">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (1-50 employees)</SelectItem>
                          <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                          <SelectItem value="large">Large (200+ employees)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-company-location" className="text-sm font-medium text-[#222327]">Location</Label>
                      <Input
                        id="register-company-location"
                        type="text"
                        placeholder="City, Country"
                        value={companyLocation}
                        onChange={(e) => setCompanyLocation(e.target.value)}
                        disabled={isLoading}
                        className="h-11 border-[#2D3559]/20 focus:border-[#FF7C23] focus:ring-[#FF7C23]/20 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-company-founded-year" className="text-sm font-medium text-[#222327]">Founded Year</Label>
                    <Input
                      id="register-company-founded-year"
                      type="number"
                      placeholder="e.g., 2020"
                      value={companyFoundedYear.toString()}
                      onChange={(e) => setCompanyFoundedYear(Number(e.target.value))}
                      disabled={isLoading}
                      className="h-11 border-[#2D3559]/20 focus:border-[#FF7C23] focus:ring-[#FF7C23]/20 text-sm"
                    />
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-[#FF7C23] to-[#2D3559] hover:from-[#FF7C23] hover:to-[#A3D958] text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}; 