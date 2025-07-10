import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, Briefcase, FileText, MessageSquare, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthModal } from "@/components/AuthModal";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import { Helmet } from 'react-helmet-async';

const Landing = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Intelligent matching between candidates and job opportunities"
    },
    {
      icon: FileText,
      title: "Smart Document Generation",
      description: "Create tailored resumes and cover letters with AI assistance"
    },
    {
      icon: MessageSquare,
      title: "AI Chat Assistant",
      description: "Get personalized insights and assistance from our AI"
    },
    {
      icon: Users,
      title: "Comprehensive Management",
      description: "Complete candidate tracking and job application management"
    }
  ];

  const benefits = [
    "Streamline your hiring or job search process",
    "AI-powered matching and recommendations",
    "Automated document generation and analysis",
    "Real-time insights and analytics",
    "Professional resume and cover letter creation",
    "Smart interview scheduling and coordination"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF7C23] to-[#2D3559]">
      {/* Header */}
      <RoleBasedNavigation onLoginClick={() => setIsAuthModalOpen(true)} />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-[#222327] mb-6">
            The Future of
            <span className="bg-gradient-to-r from-[#FF7C23] to-[#2D3559] bg-clip-text text-transparent"> Hiring & Job Search</span>
          </h1>
          <p className="text-xl text-[#2D3559] mb-8 max-w-2xl mx-auto">
            AI-powered platform connecting recruiters, job seekers, and hiring managers through 
            intelligent matching, automated document generation, and AI-driven insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/recruiter/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-[#FF7C23] to-[#2D3559] hover:from-[#e65a1a] hover:to-[#1a1f2e] text-white transition-all duration-300">
                <Briefcase className="h-5 w-5 mr-2" />
                For Recruiters
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/applicant/dashboard">
              <Button size="lg" variant="outline" className="border-[#2D3559] text-[#2D3559] hover:bg-[#2D3559] hover:text-white transition-all duration-300">
                <FileText className="h-5 w-5 mr-2" />
                For Job Seekers
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#222327] mb-4">
            Powerful Features for Everyone
          </h2>
          <p className="text-lg text-[#2D3559] max-w-2xl mx-auto">
            Whether you're hiring, job searching, or managing talent, we have the tools you need.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
                <CardHeader>
                  <div className="bg-gradient-to-r from-[#FF7C23] to-[#2D3559] p-3 rounded-lg w-fit">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold text-[#222327] mb-2">{feature.title}</h3>
                  <p className="text-[#2D3559]">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#222327] mb-6">
              Why Choose Jobsilo?
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#A3D958] flex-shrink-0" />
                  <span className="text-[#2D3559]">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-[#FF7C23] to-[#2D3559] hover:from-[#e65a1a] hover:to-[#1a1f2e] text-white transition-all duration-300"
              >
                Get Started Free
              </Button>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm border-white/20 rounded-lg p-8 hover:bg-white/80 transition-all duration-300">
            <h3 className="text-xl font-semibold text-[#222327] mb-4">For Recruiters & Hiring Managers</h3>
            <ul className="space-y-3 text-[#2D3559]">
              <li>• AI-powered candidate matching</li>
              <li>• Automated job posting and management</li>
              <li>• Real-time analytics and insights</li>
              <li>• Interview scheduling and coordination</li>
              <li>• Advanced search and filtering</li>
            </ul>
            
            <div className="mt-6 pt-6 border-t border-[#2D3559]/30">
              <h3 className="text-xl font-semibold text-[#222327] mb-4">For Job Seekers</h3>
              <ul className="space-y-3 text-[#2D3559]">
                <li>• AI-generated tailored resumes</li>
                <li>• Personalized cover letters</li>
                <li>• Job analysis and insights</li>
                <li>• PDF export functionality</li>
                <li>• Pro features for advanced users</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-[#FF7C23] to-[#2D3559] rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Career Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals using Jobsilo for smarter hiring and job searching
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              size="lg"
              variant="secondary"
              className="bg-white text-[#FF7C23] hover:bg-[#F3F8FF] transition-all duration-300"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src="/logo.svg" alt="Jobsilo Logo" className="h-8 w-8" />
            <h3 className="text-xl font-bold text-[#FF7C23]">
              Jobsilo
            </h3>
          </div>
          <p className="text-[#2D3559]">
            © 2024 Jobsilo. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <Helmet>
        <title>Jobsilo - Smart Recruitment Platform</title>
        <meta name="description" content="Jobsilo is an AI-powered recruitment platform for smart hiring, candidate matching, and streamlined talent acquisition." />
        <meta name="keywords" content="recruitment, hiring, AI, job matching, talent acquisition, HR, careers, Jobsilo, smart hiring, job platform" />
        <link rel="canonical" href="https://jobsilo.com/" />
      </Helmet>
    </div>
  );
};

export default Landing; 