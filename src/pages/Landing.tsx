import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, Briefcase, FileText, MessageSquare, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthModal } from "@/components/AuthModal";
import { Navigation } from "@/components/Navigation";
import { Helmet } from 'react-helmet-async';

const Landing = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Intelligent candidate-job matching using advanced AI algorithms"
    },
    {
      icon: FileText,
      title: "Smart Document Generation",
      description: "Create tailored resumes and cover letters with AI assistance"
    },
    {
      icon: MessageSquare,
      title: "AI Chat Assistant",
      description: "Get recruitment insights and assistance from our AI"
    },
    {
      icon: Users,
      title: "Candidate Management",
      description: "Comprehensive candidate tracking and interview scheduling"
    }
  ];

  const benefits = [
    "Reduce hiring time by 60%",
    "Improve candidate quality by 40%",
    "Automated resume parsing and analysis",
    "Real-time dashboard analytics",
    "AI-powered interview scheduling",
    "Professional document generation"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <Navigation onLoginClick={() => setIsAuthModalOpen(true)} />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Revolutionize Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Recruitment</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered recruitment platform that connects recruiters with job seekers through 
            intelligent matching, automated resume generation, and AI-driven insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Briefcase className="h-5 w-5 mr-2" />
                Recruiter Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/applicant">
              <Button size="lg" variant="outline">
                <FileText className="h-5 w-5 mr-2" />
                Job Seeker Portal
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Recruitment
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to streamline your hiring process and find the perfect candidates.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
                <CardHeader>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg w-fit">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Clever Hire?
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm border-white/20 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">For Recruiters</h3>
            <ul className="space-y-3 text-gray-600">
              <li>• AI-powered candidate matching</li>
              <li>• Automated job posting and management</li>
              <li>• Real-time analytics and insights</li>
              <li>• Interview scheduling and coordination</li>
              <li>• Advanced search and filtering</li>
            </ul>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Job Seekers</h3>
              <ul className="space-y-3 text-gray-600">
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Recruitment?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of recruiters and job seekers using Clever Hire
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Started Now
            </Button>
            <Link to="/applicant">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Explore Job Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Clever Hire
            </h3>
          </div>
          <p className="text-gray-600">
            © 2024 Clever Hire. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <Helmet>
        <title>Clever Hire - Smart Recruitment Platform</title>
        <meta name="description" content="Clever Hire is an AI-powered recruitment platform for smart hiring, candidate matching, and streamlined talent acquisition." />
        <meta name="keywords" content="recruitment, hiring, AI, job matching, talent acquisition, HR, careers, Clever Hire, smart hiring, job platform" />
        <link rel="canonical" href="https://cleverhire.com/" />
      </Helmet>
    </div>
  );
};

export default Landing; 