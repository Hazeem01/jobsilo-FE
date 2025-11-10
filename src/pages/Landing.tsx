import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Briefcase,
  FileText,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Clock,
  Globe,
  Star,
  Target,
  Lightbulb,
  Rocket,
  Mail,
  MapPin,
  Linkedin,
  Github,
} from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import FeatureShowcase from "@/components/FeatureShowcase";
import { Helmet } from "react-helmet-async";

const Landing = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const benefits = [
    "AI-guided workflows that surface ideal matches and actionable insights in seconds.",
    "Unified recruiter and applicant journeys with consistent, accessible design language.",
    "Automated resume and cover letter generation tuned to each role and seniority level.",
    "Secure authentication, role-based dashboards, and audit-friendly activity history.",
    "Responsive, performant interface powered by modern React tooling and design systems.",
    "Open platform architecture with documented endpoints for rapid team onboarding.",
  ];

  const stats = [
    { number: "4 mins", label: "Average time to publish a role", icon: Users },
    { number: "12 hrs", label: "Faster shortlisting with AI scoring", icon: Briefcase },
    { number: "93%", label: "Suggested resumes accepted by recruiters", icon: TrendingUp },
    { number: "99.9%", label: "Uptime across production deployments", icon: Clock },
  ];

  const testimonials = [
    {
      name: "TalentBridge",
      role: "Head of People Operations",
      company: "Fast-scaling marketplace",
      content:
        "Jobsilo gave our recruiters a single command centre. AI-backed scoring means we spend time with the right candidates faster than ever.",
      rating: 5,
    },
    {
      name: "BrightPath Careers",
      role: "Lead Career Coach",
      company: "Career advisory collective",
      content:
        "Applicants use the document studio to produce tailored resumes in minutes. The consistency and polish elevate every submission.",
      rating: 5,
    },
    {
      name: "Nimbus Labs",
      role: "VP of Engineering",
      company: "Product-led SaaS team",
      content:
        "Our hiring pipelines plug straight into Jobsilo’s dashboards. Real-time analytics and alerts keep leadership aligned on progress.",
      rating: 5,
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#FF7C23] via-[#A3D958] to-[#2D3559] overflow-hidden'>
      {/* Header */}
      <RoleBasedNavigation onLoginClick={() => setIsAuthModalOpen(true)} />

      {/* Hero Section */}
      <section className='container mx-auto px-6 py-20 relative'>
        {/* Animated Background Elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse'></div>
          <div className='absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce'></div>
          <div className='absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping'></div>
          <div className='absolute top-1/2 right-10 w-8 h-8 bg-[#A3D958]/20 rounded-full animate-float'></div>
          <div
            className='absolute bottom-1/3 left-20 w-6 h-6 bg-[#FF7C23]/20 rounded-full animate-float'
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <Badge className='mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300 animate-fade-in-up'>
              <Rocket className='h-4 w-4 mr-2' />
              Modern AI Recruitment Platform
            </Badge>

            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight animate-fade-in-up'>
              Jobsilo delivers a
              <span className='block bg-gradient-to-r from-white to-[#A3D958] bg-clip-text text-transparent'>
                new standard for hiring
              </span>
            </h1>

            <p className='text-xl md:text-2xl text-white/90 mb-10 max-w-2xl leading-relaxed animate-fade-in-up'>
              Jobsilo is a modern hiring suite built to show how AI, thoughtful
              UX, and robust engineering can unite every step of the talent
              journey—from sourcing to signed offer—in one cohesive brand
              experience.
            </p>

            <div className='flex flex-col sm:flex-row gap-6 justify-start mb-12 animate-fade-in-up'>
              <Button
                size='lg'
                className='bg-white text-[#FF7C23] hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-lift'
                onClick={() => setIsAuthModalOpen(true)}
              >
                <Briefcase className='h-5 w-5 mr-2' />
                Try the demo
                <ArrowRight className='h-5 w-5 ml-2' />
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='border-white text-[#2D3559] hover:bg-white hover:text-[#FF7C23] transition-all duration-300 transform hover:scale-105 hover-lift'
                asChild
              >
                <a
                  href='https://github.com/Hazeem01/jobsilo-FE'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center'
                >
                  <FileText className='h-5 w-5 mr-2' />
                  View the code
                  <ArrowRight className='h-5 w-5 ml-2' />
                </a>
              </Button>
            </div>

            {/* Stats Section */}
            <div className='grid grid-cols-2 gap-6 mt-12'>
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className={`text-center transition-all duration-700 delay-${
                      index * 100
                    } ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                  >
                    <div className='bg-white/20 backdrop-blur-sm rounded-full p-3 w-fit mx-auto mb-3 hover-lift'>
                      <IconComponent className='h-6 w-6 text-white' />
                    </div>
                    <div className='text-2xl font-bold text-white mb-1'>
                      {stat.number}
                    </div>
                    <div className='text-white/80 text-sm'>{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className='relative'>
              <img
                src='https://wmuiedzylbohmoppmncs.supabase.co/storage/v1/object/sign/general/Jobsilo%20Images/image.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NTg1NDhkMi01ZjFiLTQ2ODMtYWFkNy0xYjc0NjhkMjg4YTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW5lcmFsL0pvYnNpbG8gSW1hZ2VzL2ltYWdlLnBuZyIsImlhdCI6MTc1MjE5NTg1NSwiZXhwIjoxOTA5ODc1ODU1fQ.nkVPFMCOV4ySDDeXsmxexL4Wqza8FP_jyzqNymzK97Q'
                alt='AI-Powered Recruitment'
                className='w-full h-auto animate-float'
              />
              {/* Floating Elements */}
              <div className='absolute top-10 left-10 w-4 h-4 bg-[#FF7C23]/60 rounded-full animate-pulse'></div>
              <div className='absolute top-20 right-20 w-3 h-3 bg-[#A3D958]/60 rounded-full animate-bounce'></div>
              <div className='absolute bottom-20 left-1/4 w-2 h-2 bg-[#2D3559]/60 rounded-full animate-ping'></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='container mx-auto px-6 py-20'>
        <div className='text-center mb-16'>
          <Badge className='mb-4 bg-white/20 text-white border-white/30 animate-fade-in-up'>
            <Lightbulb className='h-4 w-4 mr-2' />
            Built end-to-end
          </Badge>
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up'>
            What powers Jobsilo
          </h2>
          <p className='text-xl text-white/80 max-w-3xl mx-auto animate-fade-in-up'>
            The experience blends product strategy with engineering rigour: AI
            insights, document automation, analytics, and UI states all stitched
            together to feel cohesive and production ready.
          </p>
        </div>

        <FeatureShowcase />
      </section>

      {/* Benefits Section */}
      <section className='container mx-auto px-6 py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <Badge className='mb-4 bg-white/20 text-white border-white/30'>
              <Target className='h-4 w-4 mr-2' />
              Why teams choose Jobsilo
            </Badge>
            <h2 className='text-4xl font-bold text-white mb-8'>
              Designed for confident hiring
            </h2>
            <div className='space-y-6'>
              {benefits.map((benefit, index) => (
                <div key={index} className='flex items-start space-x-4'>
                  <div className='bg-[#A3D958] p-2 rounded-full mt-1'>
                    <CheckCircle className='h-5 w-5 text-white' />
                  </div>
                  <span className='text-white/90 text-lg'>{benefit}</span>
                </div>
              ))}
            </div>
            <div className='mt-10'>
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                size='lg'
                className='bg-white text-[#FF7C23] hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg'
              >
                <Rocket className='h-5 w-5 mr-2' />
                Launch the demo
              </Button>
            </div>
          </div>

          <div
            className={`bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className='space-y-8'>
              <div>
                <h3 className='text-2xl font-semibold text-white mb-6 flex items-center'>
                  <Briefcase className='h-6 w-6 mr-3 text-[#A3D958]' />
                  Recruiter experience
                </h3>
                <ul className='space-y-4 text-white/90'>
                  <li className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-[#A3D958] rounded-full'></div>
                    <span>AI-powered candidate matching</span>
                  </li>
                  <li className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-[#A3D958] rounded-full'></div>
                    <span>Automated job posting and management</span>
                  </li>
                  <li className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-[#A3D958] rounded-full'></div>
                    <span>Real-time analytics and insights</span>
                  </li>
                  <li className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-[#A3D958] rounded-full'></div>
                    <span>Interview scheduling and coordination</span>
                  </li>
                  <li className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-[#A3D958] rounded-full'></div>
                    <span>Advanced search and filtering</span>
                  </li>
                </ul>
              </div>

              <div className='pt-8 border-t border-white/20'>
                <h3 className='text-2xl font-semibold text-white mb-6 flex items-center'>
                  <FileText className='h-6 w-6 mr-3 text-[#A3D958]' />
                  Applicant journey
                </h3>
                <ul className='space-y-4 text-white/90'>
                  <li className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-[#A3D958] rounded-full'></div>
                    <span>AI-generated tailored resumes</span>
                  </li>
                  <li className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-[#A3D958] rounded-full'></div>
                  <span>Personalised cover letters</span>
                  </li>
                  <li className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-[#A3D958] rounded-full'></div>
                    <span>Job analysis and insights</span>
                  </li>
                  <li className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-[#A3D958] rounded-full'></div>
                    <span>PDF export functionality</span>
                  </li>
                  <li className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-[#A3D958] rounded-full'></div>
                    <span>Pro features for advanced users</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Highlights Section */}
      <section className='container mx-auto px-6 py-20'>
        <div className='text-center mb-16'>
          <Badge className='mb-4 bg-white/20 text-white border-white/30 animate-fade-in-up'>
            <Star className='h-4 w-4 mr-2' />
            Customer snapshots
          </Badge>
          <h2 className='text-4xl font-bold text-white mb-6 animate-fade-in-up'>
            Stories from the platform
          </h2>
          <p className='text-xl text-white/80 max-w-2xl mx-auto animate-fade-in-up'>
            Explore how teams across industries reimagine recruitment with
            Jobsilo’s intelligent workflows and unified experience.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover-lift ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <CardContent className='p-6'>
                <div className='flex items-center mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className='h-5 w-5 text-yellow-400 fill-current'
                    />
                  ))}
                </div>
                <p className='text-white/90 mb-6 italic text-lg leading-relaxed'>
                  "{testimonial.content}"
                </p>
                <div className='flex items-center space-x-3'>
                  <div className='w-12 h-12 bg-gradient-to-r from-[#FF7C23] to-[#2D3559] rounded-full flex items-center justify-center hover-lift'>
                    <span className='text-white font-semibold'>
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className='text-white font-semibold'>
                      {testimonial.name}
                    </div>
                    <div className='text-white/70 text-sm'>
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Build Metrics */}
        <div className='mt-16 text-center'>
          <div className='bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl p-8 hover-lift'>
            <h3 className='text-2xl font-bold text-white mb-4'>
              Build at a glance
            </h3>
            <p className='text-white/80 mb-6 max-w-2xl mx-auto'>
              Jobsilo combines product design, AI-assisted decision making, and
              scalable engineering to deliver measurable improvements for every
              hiring squad.
            </p>
            <div className='flex flex-wrap justify-center gap-8 text-white/60'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-white'>40+</div>
                <div className='text-sm'>Reusable components</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-white'>3</div>
                <div className='text-sm'>Integrated APIs</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-white'>∞</div>
                <div className='text-sm'>Curiosity & iteration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='container mx-auto px-6 py-20'>
        <div
          className={`bg-gradient-to-r from-[#FF7C23] to-[#2D3559] rounded-3xl p-12 text-center text-white relative overflow-hidden transition-all duration-1000 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* Background Animation */}
          <div className='absolute inset-0'>
            <div className='absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse'></div>
            <div className='absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce'></div>
            <div className='absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping'></div>
            <div className='absolute top-1/3 right-1/4 w-8 h-8 bg-white/10 rounded-full animate-float'></div>
            <div
              className='absolute bottom-1/3 left-1/3 w-6 h-6 bg-white/10 rounded-full animate-float'
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          <div className='relative z-10'>
            <Badge className='mb-6 bg-white/20 text-white border-white/30 animate-fade-in-up'>
              <Rocket className='h-4 w-4 mr-2' />
              Like what you see?
            </Badge>
            <h2 className='text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up'>
              Let’s build something together
            </h2>
            <p className='text-xl mb-10 opacity-90 max-w-2xl mx-auto animate-fade-in-up'>
              Whether you are exploring AI-assisted recruitment or need a
              product-minded engineer, I’d love to chat about how Jobsilo’s
              approach can translate to your team.
            </p>
            <div className='flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up'>
              <Button
                size='lg'
                className='bg-white text-[#FF7C23] hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover-lift'
                asChild
              >
                <a href='mailto:hazeem@hazeem.dev' className='flex items-center'>
                  <Rocket className='h-5 w-5 mr-2' />
                  Contact Jobsilo
                </a>
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='border-white text-[#2D3559] hover:bg-white hover:text-[#FF7C23] transition-all duration-300 transform hover:scale-105 hover-lift'
                asChild
              >
                <a
                  href='https://www.linkedin.com/in/abdulhazeem-adenekan'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center'
                >
                  <Globe className='h-5 w-5 mr-2' />
                  Follow on LinkedIn
                </a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className='mt-12 pt-8 border-t border-white/20'>
              <p className='text-white/70 mb-4'>
                Powered by a thoughtfully curated stack
              </p>
              <div className='flex flex-wrap justify-center gap-8 opacity-60'>
                <div className='text-white/50 text-sm'>
                  ⚛️ React + TypeScript
                </div>
                <div className='text-white/50 text-sm'>⚡ Vite + Vercel deploys</div>
                <div className='text-white/50 text-sm'>🤖 AI-first flows</div>
                <div className='text-white/50 text-sm'>
                  📊 Real-time analytics
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-white/10 backdrop-blur-md border-t border-white/20 py-12'>
        <div className='container mx-auto px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-10'>
            <div className='space-y-6 text-center lg:text-left'>
              <div className='flex items-center justify-center lg:justify-start space-x-3'>
                <img
                  src='/logo.svg'
                  alt='Jobsilo Logo'
                  className='h-10 w-10 hover-lift'
                />
                <h3 className='text-2xl font-bold text-white'>Jobsilo</h3>
              </div>
              <p className='text-white/80 mb-4'>
                The future of AI-powered recruitment and job searching.
              </p>
              <p className='text-white/80 mb-4'>
                Crafted by{" "}
                <a
                  href='https://www.hazeem.dev'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[#FF7C23] hover:text-white transition-colors font-medium'
                >
                  Hazeem
                </a>
                . Explore more projects and insights at hazeem.dev.
              </p>
              <div className='flex flex-col sm:flex-row sm:flex-wrap items-center lg:items-start gap-4 text-white/80'>
                <a
                  href='mailto:hazeem@hazeem.dev'
                  className='flex items-center space-x-2 rounded-full border border-white/20 px-4 py-2 hover:border-white/40 hover:text-white transition-colors'
                >
                  <Mail className='h-4 w-4 text-[#FF7C23]' />
                  <span>hazeem@hazeem.dev</span>
                </a>
                <div className='flex items-center space-x-2 rounded-full border border-white/20 px-4 py-2'>
                  <MapPin className='h-4 w-4 text-[#FF7C23]' />
                  <span>London · GMT</span>
                </div>
                <a
                  href='https://www.linkedin.com/in/abdulhazeem-adenekan'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center space-x-2 rounded-full border border-white/20 px-4 py-2 hover:border-white/40 hover:text-white transition-colors'
                >
                  <Linkedin className='h-4 w-4 text-[#FF7C23]' />
                  <span>LinkedIn</span>
                </a>
                <a
                  href='https://github.com/Hazeem01/jobsilo-FE'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center space-x-2 rounded-full border border-white/20 px-4 py-2 hover:border-white/40 hover:text-white transition-colors'
                >
                  <Github className='h-4 w-4 text-[#FF7C23]' />
                  <span>GitHub Repo</span>
                </a>
              </div>
            </div>

            <div className='space-y-4 text-center lg:text-left'>
              <h4 className='text-white font-semibold tracking-wide uppercase text-sm'>
                Platform
              </h4>
              <ul className='space-y-3 text-white/80 text-sm'>
                <li>
                  <a className='hover:text-white transition-colors' href='#'>
                    Recruiter workspace
                  </a>
                </li>
                <li>
                  <a className='hover:text-white transition-colors' href='#'>
                    Applicant toolkit
                  </a>
                </li>
                <li>
                  <a className='hover:text-white transition-colors' href='#'>
                    AI automations
                  </a>
                </li>
                <li>
                  <a className='hover:text-white transition-colors' href='#'>
                    Analytics overview
                  </a>
                </li>
              </ul>
            </div>

            <div className='space-y-4 text-center lg:text-left'>
              <h4 className='text-white font-semibold tracking-wide uppercase text-sm'>
                Resources
              </h4>
              <ul className='space-y-3 text-white/80 text-sm'>
                <li>
                  <a className='hover:text-white transition-colors' href='#'>
                    Product updates
                  </a>
                </li>
                <li>
                  <a className='hover:text-white transition-colors' href='#'>
                    Documentation
                  </a>
                </li>
                <li>
                  <a className='hover:text-white transition-colors' href='#'>
                    Support centre
                  </a>
                </li>
                <li>
                  <a className='hover:text-white transition-colors' href='#'>
                    Privacy & terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-white/10 mt-12 pt-8'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60'>
              <p>© {new Date().getFullYear()} Jobsilo. Built in London with ambition.</p>
              <div className='flex items-center space-x-4'>
                <a className='hover:text-white transition-colors' href='#'>
                  Privacy
                </a>
                <a className='hover:text-white transition-colors' href='#'>
                  Terms
                </a>
                <a className='hover:text-white transition-colors' href='#'>
                  Status
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <Helmet>
        <title>
          Jobsilo - AI-Powered Recruitment & Job Application Platform | Smart
          Hiring & Job Search
        </title>
        <meta
          name='description'
          content='Jobsilo is the future of recruitment. AI-powered platform connecting recruiters, job seekers, and hiring managers through intelligent matching, automated document generation, and AI-driven insights.'
        />
        <meta
          name='keywords'
          content='recruitment, hiring, AI, job matching, talent acquisition, HR, careers, Jobsilo, smart hiring, job platform, AI recruitment, resume builder, cover letter generator'
        />
        <link rel='canonical' href='https://jobsilo.hazeem.dev/' />
        <meta
          property='og:title'
          content='Jobsilo - AI-Powered Recruitment & Job Application Platform'
        />
        <meta
          property='og:description'
          content='Transform your career journey with AI-powered recruitment and job searching.'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://jobsilo.hazeem.dev/' />
      </Helmet>
    </div>
  );
};

export default Landing;
