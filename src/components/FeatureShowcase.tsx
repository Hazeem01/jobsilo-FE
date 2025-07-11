import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  FileText,
  MessageSquare,
  Users,
  Zap,
  Shield,
} from "lucide-react";

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  image: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: "AI-Powered Matching",
    description:
      "Advanced algorithms match candidates with perfect job opportunities using machine learning and natural language processing",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    image:
      "https://wmuiedzylbohmoppmncs.supabase.co/storage/v1/object/sign/general/Jobsilo%20Images/Screenshot%202025-07-11%20at%2002.51.01.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NTg1NDhkMi01ZjFiLTQ2ODMtYWFkNy0xYjc0NjhkMjg4YTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW5lcmFsL0pvYnNpbG8gSW1hZ2VzL1NjcmVlbnNob3QgMjAyNS0wNy0xMSBhdCAwMi41MS4wMS5wbmciLCJpYXQiOjE3NTIxOTg2NzksImV4cCI6MTkwOTg3ODY3OX0.gGGBC-bgFw8-dim1p9a64dpY-xndw7L9Ydii1DHhdTs",
  },
  {
    id: 2,
    title: "Smart Document Generation",
    description:
      "Create professional resumes and cover letters with AI assistance that adapts to your experience and target roles",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    image:
      "https://wmuiedzylbohmoppmncs.supabase.co/storage/v1/object/sign/general/Jobsilo%20Images/Screenshot%202025-07-11%20at%2002.16.32.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NTg1NDhkMi01ZjFiLTQ2ODMtYWFkNy0xYjc0NjhkMjg4YTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW5lcmFsL0pvYnNpbG8gSW1hZ2VzL1NjcmVlbnNob3QgMjAyNS0wNy0xMSBhdCAwMi4xNi4zMi5wbmciLCJpYXQiOjE3NTIxOTY4NjIsImV4cCI6MTkwOTg3Njg2Mn0.j2tC43Id9_NRVaLvT4AN_Q9C_3AZLyotz58j4hnE99Y",
  },
  {
    id: 3,
    title: "AI Chat Assistant",
    description:
      "Get personalized career advice, interview tips, and job search strategies from our intelligent AI assistant",
    icon: MessageSquare,
    color: "from-green-500 to-emerald-500",
    image:
      "https://wmuiedzylbohmoppmncs.supabase.co/storage/v1/object/sign/general/Jobsilo%20Images/Screenshot%202025-07-11%20at%2002.17.01.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NTg1NDhkMi01ZjFiLTQ2ODMtYWFkNy0xYjc0NjhkMjg4YTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW5lcmFsL0pvYnNpbG8gSW1hZ2VzL1NjcmVlbnNob3QgMjAyNS0wNy0xMSBhdCAwMi4xNy4wMS5wbmciLCJpYXQiOjE3NTIxOTY5MjMsImV4cCI6MTkwOTg3NjkyM30.xsahHPH_tUojQhpPrdsSIraa1PeXo2otk_cMOCJUTmc",
  },
  {
    id: 4,
    title: "Comprehensive Management",
    description:
      "Complete candidate tracking, interview scheduling, and application management in one unified platform",
    icon: Users,
    color: "from-orange-500 to-red-500",
    image:
      "https://wmuiedzylbohmoppmncs.supabase.co/storage/v1/object/sign/general/Jobsilo%20Images/Screenshot%202025-07-11%20at%2002.37.08.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NTg1NDhkMi01ZjFiLTQ2ODMtYWFkNy0xYjc0NjhkMjg4YTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW5lcmFsL0pvYnNpbG8gSW1hZ2VzL1NjcmVlbnNob3QgMjAyNS0wNy0xMSBhdCAwMi4zNy4wOC5wbmciLCJpYXQiOjE3NTIxOTc4NDMsImV4cCI6MTkwOTg3Nzg0M30.yLsh5OZrKiBhLPKjGYOSIKeOLqmw-3iXODdn2pa8OPM",
  },
  {
    id: 5,
    title: "Lightning Fast",
    description:
      "Instant job matching, real-time notifications, and rapid document generation for maximum efficiency",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    image:
      "https://wmuiedzylbohmoppmncs.supabase.co/storage/v1/object/sign/general/Jobsilo%20Images/Screenshot%202025-07-11%20at%2002.51.01.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NTg1NDhkMi01ZjFiLTQ2ODMtYWFkNy0xYjc0NjhkMjg4YTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW5lcmFsL0pvYnNpbG8gSW1hZ2VzL1NjcmVlbnNob3QgMjAyNS0wNy0xMSBhdCAwMi41MS4wMS5wbmciLCJpYXQiOjE3NTIxOTg2NzksImV4cCI6MTkwOTg3ODY3OX0.gGGBC-bgFw8-dim1p9a64dpY-xndw7L9Ydii1DHhdTs",
  },
  {
    id: 6,
    title: "Enterprise Security",
    description:
      "Bank-level security with end-to-end encryption, GDPR compliance, and secure data handling",
    icon: Shield,
    color: "from-indigo-500 to-purple-500",
    image:
      "https://wmuiedzylbohmoppmncs.supabase.co/storage/v1/object/sign/general/Jobsilo%20Images/Screenshot%202025-07-11%20at%2002.54.09.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NTg1NDhkMi01ZjFiLTQ2ODMtYWFkNy0xYjc0NjhkMjg4YTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW5lcmFsL0pvYnNpbG8gSW1hZ2VzL1NjcmVlbnNob3QgMjAyNS0wNy0xMSBhdCAwMi41NC4wOS5wbmciLCJpYXQiOjE3NTIxOTg4NjYsImV4cCI6MTkwOTg3ODg2Nn0.Nf0z7ShiqQNHGFkwTRORETBR2gZIoc7Pm2s-y8TjGfo",
  },
];

const FeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
      {/* Feature Image Display */}
      <div className='relative h-96 lg:h-[500px]'>
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === activeFeature
                ? "opacity-100 scale-100 translate-x-0"
                : "opacity-0 scale-95 translate-x-4"
            }`}
          >
            <div className='relative w-full h-full'>
              <img
                src={feature.image}
                alt={feature.title}
                className='w-full h-full object-contain animate-float'
              />
              {/* Floating elements around the image */}
              <div className='absolute top-4 left-4 w-3 h-3 bg-[#FF7C23]/60 rounded-full animate-pulse'></div>
              <div className='absolute top-8 right-8 w-2 h-2 bg-[#A3D958]/60 rounded-full animate-bounce'></div>
              <div className='absolute bottom-6 left-1/3 w-2 h-2 bg-[#2D3559]/60 rounded-full animate-ping'></div>
            </div>
          </div>
        ))}

        {/* Navigation Dots */}
        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeFeature
                  ? "bg-white scale-125"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Feature Content */}
      <div
        className={`transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
        }`}
      >
        <div className='space-y-6'>
          {features.map((feature, index) => (
            <Card
              key={feature.id}
              className={`bg-white/10 backdrop-blur-sm border-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover-lift cursor-pointer ${
                index === activeFeature
                  ? "bg-white/20 border-white/40 scale-105"
                  : "opacity-60 hover:opacity-80"
              } ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => setActiveFeature(index)}
            >
              <CardContent className='p-6'>
                <div className='flex items-start space-x-4'>
                  <div
                    className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl shadow-lg flex-shrink-0`}
                  >
                    <feature.icon className='h-6 w-6 text-white' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-xl font-semibold text-white mb-2'>
                      {feature.title}
                    </h3>
                    <p className='text-white/80 leading-relaxed'>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
