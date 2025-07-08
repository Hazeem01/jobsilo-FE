// Application Configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: (import.meta as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
    timeout: 30000, // 30 seconds
  },
  
  // Feature Flags
  features: {
    debugMode: (import.meta as { env?: { VITE_DEBUG_MODE?: string } }).env?.VITE_DEBUG_MODE === 'true',
    mockApi: (import.meta as { env?: { VITE_MOCK_API?: string } }).env?.VITE_MOCK_API === 'true',
  },
  
  // UI Configuration
  ui: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFileTypes: ['.pdf', '.doc', '.docx', '.txt'],
    pagination: {
      defaultPageSize: 10,
      maxPageSize: 50,
    },
  },
  
  // Authentication
  auth: {
    tokenKey: 'auth_token',
    refreshThreshold: 5 * 60 * 1000, // 5 minutes
  },
  
  // Chat Configuration
  chat: {
    maxMessageLength: 1000,
    typingIndicatorDelay: 1000,
  },
};

export default config; 