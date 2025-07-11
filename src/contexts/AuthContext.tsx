import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, User, Company } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, firstName: string, lastName: string, role?: 'recruiter' | 'applicant', company?: Company) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await apiClient.login(email, password);
      // Save the token to localStorage and set it in the API client
      apiClient.setToken(response.data.token);
      setUser(response.data.user);
      console.log('🔐 Login successful - Token saved');
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.data.user.firstName}!`,
      });
      return response.data.user;
    } catch (error) {
      console.error('🔐 Login failed:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    role: 'recruiter' | 'applicant' = 'applicant',
    company?: Company
  ): Promise<User> => {
    try {
      const response = await apiClient.register(email, password, firstName, lastName, role, company);
      // Save the token to localStorage and set it in the API client
      apiClient.setToken(response.data.token);
      setUser(response.data.user);
      console.log('🔐 Registration successful - Token saved');
      toast({
        title: "Registration successful",
        description: `Welcome to Jobsilo, ${response.data.user.firstName}!`,
      });
      return response.data.user;
    } catch (error) {
      console.error('🔐 Registration failed:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      // Clear the token from localStorage and API client
      apiClient.clearToken();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      // Even if logout fails, clear local state and token
      apiClient.clearToken();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out.",
      });
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we have a token in localStorage - use the same key as API client
      const token = localStorage.getItem('auth_token');
      console.log('🔐 Initializing auth - Token found:', !!token);
      
      if (token) {
        // Set the token in the API client
        apiClient.setToken(token);
        try {
          await refreshUser();
          console.log('🔐 User refreshed successfully');
        } catch (error) {
          console.error('🔐 Failed to refresh user:', error);
          // Token is invalid, clear it
          apiClient.clearToken();
          setUser(null);
        }
      } else {
        console.log('🔐 No token found in localStorage');
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 