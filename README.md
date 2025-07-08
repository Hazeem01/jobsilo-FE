# AI Recruiter - Enhanced Application

A modern, AI-powered recruitment platform that connects recruiters with job seekers through intelligent matching, automated resume generation, and AI-driven insights.

## 🚀 Features

### For Recruiters
- **Dashboard Analytics**: Real-time metrics and insights
- **Job Management**: Create, edit, and delete job postings
- **Candidate Matching**: AI-powered candidate recommendations
- **Interview Scheduling**: Manage interview processes
- **AI Chat Assistant**: Get recruitment insights and assistance

### For Job Seekers
- **Resume Upload & Parsing**: Upload and parse existing resumes
- **AI Resume Generation**: Create tailored resumes for specific jobs
- **Cover Letter Generation**: Generate personalized cover letters
- **Job Analysis**: AI-powered job posting analysis
- **PDF Export**: Export documents in professional formats
- **Pro Features**: Advanced AI capabilities and priority processing

### Core Features
- **Authentication**: Secure user registration and login
- **Real-time Data**: Live updates with React Query
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error management
- **Loading States**: Smooth user experience with loading indicators

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Query** for server state management
- **React Router** for navigation
- **Lucide React** for icons

### Backend Integration
- **RESTful API** with comprehensive endpoints
- **JWT Authentication** for secure user sessions
- **File Upload** support for resumes and documents
- **AI Integration** for document generation and analysis

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Recruiter Dashboard
- `GET /api/v1/dashboard/stats` - Dashboard metrics
- `GET /api/v1/dashboard/jobs` - List all jobs
- `POST /api/v1/dashboard/jobs` - Create new job posting
- `PUT /api/v1/dashboard/jobs/:id` - Update job posting
- `DELETE /api/v1/dashboard/jobs/:id` - Delete job posting
- `GET /api/v1/dashboard/candidates` - List candidates
- `GET /api/v1/dashboard/candidates/:id` - Get candidate details

### Applicant Features
- `POST /api/v1/applicant/resumes/upload` - Upload resume file
- `POST /api/v1/applicant/resumes/parse` - Parse resume text
- `POST /api/v1/applicant/ai/analyze-job` - Analyze job posting
- `POST /api/v1/applicant/ai/generate-resume` - Generate tailored resume
- `POST /api/v1/applicant/ai/generate-cover-letter` - Generate cover letter
- `POST /api/v1/applicant/export/resume` - Export resume as PDF
- `POST /api/v1/applicant/export/cover-letter` - Export cover letter as PDF
- `POST /api/v1/applicant/pro/signup` - Pro version signup

### Interview Management
- `GET /api/v1/applicant/interviews` - List interviews
- `POST /api/v1/applicant/interviews` - Schedule interview

### AI Chat
- `POST /api/v1/chat/message` - Send message to AI
- `GET /api/v1/chat/history` - Get chat history
- `DELETE /api/v1/chat/history` - Clear chat history
- `GET /api/v1/chat/suggestions` - Get chat suggestions

### File Management
- `POST /api/v1/files/upload` - Upload file
- `GET /api/v1/files/:id` - Get file information
- `GET /api/v1/files/:id/download` - Download file
- `DELETE /api/v1/files/:id` - Delete file
- `GET /api/v1/files/user/files` - Get user's files

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clever-hire-compass-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── AIChat.tsx      # AI chat interface
│   ├── AuthModal.tsx   # Authentication modal
│   ├── CandidateCard.tsx
│   ├── DashboardStats.tsx
│   ├── JobCard.tsx
│   └── JobPostingModal.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom hooks
│   ├── use-api.ts      # API hooks with React Query
│   └── use-toast.ts    # Toast notifications
├── lib/                # Utility libraries
│   ├── api.ts          # API client and types
│   └── utils.ts        # Utility functions
├── pages/              # Page components
│   ├── Index.tsx       # Recruiter dashboard
│   ├── Applicant.tsx   # Job seeker portal
│   └── NotFound.tsx    # 404 page
└── App.tsx             # Main app component
```

## 🔧 Configuration

### Environment Variables
- `VITE_API_BASE_URL`: Backend API base URL (default: http://localhost:3000/api/v1)

### API Configuration
The application uses a centralized API client (`src/lib/api.ts`) that handles:
- Authentication token management
- Request/response interceptors
- Error handling
- TypeScript type safety

## 🎨 UI Components

The application uses a comprehensive set of UI components from Shadcn/ui:
- **Cards**: For content organization
- **Buttons**: Various button styles and states
- **Forms**: Input fields, textareas, selects
- **Modals**: Dialogs and overlays
- **Badges**: Status indicators
- **Tabs**: Content organization
- **Toast**: Notifications

## 🔐 Authentication

The application implements a complete authentication system:
- **User Registration**: Sign up as recruiter or applicant
- **User Login**: Secure authentication with JWT
- **Session Management**: Automatic token refresh
- **Protected Routes**: Role-based access control
- **Logout**: Secure session termination

## 📊 State Management

- **React Query**: Server state management with caching
- **React Context**: Client state for authentication
- **Local Storage**: Token persistence
- **Optimistic Updates**: Smooth user experience

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **React Query DevTools**: Development debugging

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
Ensure your production environment has:
- Backend API running and accessible
- Environment variables configured
- CORS properly configured on backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- **Real-time Notifications**: WebSocket integration
- **Advanced Analytics**: Detailed recruitment insights
- **Mobile App**: React Native version
- **AI Improvements**: Enhanced document generation
- **Integration APIs**: ATS and job board integrations
- **Multi-language Support**: Internationalization
- **Advanced Search**: Elasticsearch integration
- **Video Interviews**: Built-in video calling
- **Assessment Tools**: Skills testing platform
- **Analytics Dashboard**: Advanced reporting

---

Built with ❤️ using modern web technologies
