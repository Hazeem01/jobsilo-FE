import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
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

    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      onClose();
      setLoginEmail('');
      setLoginPassword('');
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

    setIsLoading(true);
    try {
      const companyData = registerCompany ? {
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
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full max-w-[95vw] p-3 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl shadow-lg bg-white/95 dark:bg-gray-900/95 overflow-y-auto max-h-[90vh] sm:max-h-[80vh] flex flex-col justify-center">
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome to Clever Hire
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4">
            <TabsTrigger value="login" className="text-sm sm:text-base lg:text-lg py-2 sm:py-3">Login</TabsTrigger>
            <TabsTrigger value="register" className="text-sm sm:text-base lg:text-lg py-2 sm:py-3">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-3 sm:space-y-4">
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm sm:text-base">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-10 sm:h-12 text-sm sm:text-base px-3 sm:px-4"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm sm:text-base">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-10 sm:h-12 text-sm sm:text-base px-3 sm:px-4 pr-10 sm:pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-2 sm:px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full h-10 sm:h-12 text-sm sm:text-base mt-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="register-first-name" className="text-base">First Name</Label>
                  <Input
                    id="register-first-name"
                    type="text"
                    placeholder="First name"
                    value={registerFirstName}
                    onChange={(e) => setRegisterFirstName(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-12 text-base px-4"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-last-name" className="text-base">Last Name</Label>
                  <Input
                    id="register-last-name"
                    type="text"
                    placeholder="Last name"
                    value={registerLastName}
                    onChange={(e) => setRegisterLastName(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-12 text-base px-4"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-base">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-12 text-base px-4"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-base">Password</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-12 text-base px-4 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-role" className="text-base">I am a...</Label>
                <select
                  id="register-role"
                  value={registerRole}
                  onChange={(e) => setRegisterRole(e.target.value as 'recruiter' | 'applicant')}
                  disabled={isLoading}
                  className="w-full h-12 px-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="applicant">Job Seeker</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>
              
              {registerRole === 'recruiter' && (
                <div className="space-y-2">
                  <Label htmlFor="register-company" className="text-base">Company Name</Label>
                  <Input
                    id="register-company"
                    type="text"
                    placeholder="Enter your company name"
                    value={registerCompany}
                    onChange={(e) => setRegisterCompany(e.target.value)}
                    disabled={isLoading}
                    className="h-12 text-base px-4"
                  />
                </div>
              )}
              
              {registerRole === 'recruiter' && (
                <div className="space-y-2">
                  <Label htmlFor="register-company-description" className="text-base">Company Description</Label>
                  <Input
                    id="register-company-description"
                    type="text"
                    placeholder="Enter your company description"
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    disabled={isLoading}
                    className="h-12 text-base px-4"
                  />
                </div>
              )}
              
              {registerRole === 'recruiter' && (
                <div className="space-y-2">
                  <Label htmlFor="register-company-website" className="text-base">Company Website</Label>
                  <Input
                    id="register-company-website"
                    type="text"
                    placeholder="Enter your company website"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    disabled={isLoading}
                    className="h-12 text-base px-4"
                  />
                </div>
              )}
              
              {registerRole === 'recruiter' && (
                <div className="space-y-2">
                  <Label htmlFor="register-company-industry" className="text-base">Company Industry</Label>
                  <Input
                    id="register-company-industry"
                    type="text"
                    placeholder="Enter your company industry"
                    value={companyIndustry}
                    onChange={(e) => setCompanyIndustry(e.target.value)}
                    disabled={isLoading}
                    className="h-12 text-base px-4"
                  />
                </div>
              )}
              
              {registerRole === 'recruiter' && (
                <div className="space-y-2">
                  <Label htmlFor="register-company-size" className="text-base">Company Size</Label>
                  <select
                    id="register-company-size"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value as 'small' | 'medium' | 'large')}
                    disabled={isLoading}
                    className="w-full h-12 px-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              )}
              
              {registerRole === 'recruiter' && (
                <div className="space-y-2">
                  <Label htmlFor="register-company-location" className="text-base">Company Location</Label>
                  <Input
                    id="register-company-location"
                    type="text"
                    placeholder="Enter your company location"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    disabled={isLoading}
                    className="h-12 text-base px-4"
                  />
                </div>
              )}
              
              {registerRole === 'recruiter' && (
                <div className="space-y-2">
                  <Label htmlFor="register-company-founded-year" className="text-base">Company Founded Year</Label>
                  <Input
                    id="register-company-founded-year"
                    type="text"
                    placeholder="Enter your company founded year"
                    value={companyFoundedYear.toString()}
                    onChange={(e) => setCompanyFoundedYear(Number(e.target.value))}
                    disabled={isLoading}
                    className="h-12 text-base px-4"
                  />
                </div>
              )}
              
              <Button type="submit" className="w-full h-12 text-base mt-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}; 