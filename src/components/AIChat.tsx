import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, Loader2, Sparkles, MessageSquare, Brain } from "lucide-react";
import { useChatHistory, useSendChatMessage, useChatSuggestions } from "@/hooks/use-api";
import { useAuth } from "@/contexts/AuthContext";
import type { ChatMessage } from "@/lib/api";

const AIChat = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { isAuthenticated } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // API hooks
  const { data: chatHistoryResponse, isLoading: historyLoading } = useChatHistory();
  const sendMessage = useSendChatMessage();
  const { data: suggestionsResponse } = useChatSuggestions();

  // Extract data from responses
  const suggestions = suggestionsResponse?.data?.suggestions || [];

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle scroll events to show/hide scroll button
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isScrolledUp = scrollTop + clientHeight < scrollHeight - 10;
      setShowScrollButton(isScrolledUp);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (chatHistoryResponse?.data?.conversations?.[0]?.length > 0) {
      setMessages(chatHistoryResponse.data.conversations[0]);
    }
  }, [chatHistoryResponse]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isAuthenticated) return;

    try {
      const response = await sendMessage.mutateAsync({ message: inputValue });
      
      // Add user message to local state
      const userMessage: ChatMessage = {
        role: 'user',
        content: inputValue,
        created_at: new Date().toISOString()
      };
      
      // Add AI response to local state
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.message,
        created_at: response.data.timestamp
      };
      
      setMessages(prev => [...prev, userMessage, aiMessage]);
      setInputValue("");
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setInputValue(suggestion);
  };

  if (!isAuthenticated) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-blue-50/50 to-purple-50/50">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-white/20 bg-white/30 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-xs text-gray-600">Your recruitment companion</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center items-center p-6">
          <div className="text-center space-y-4 max-w-sm">
            <div className="relative">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 p-1 bg-yellow-400 rounded-full">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Sign in to chat with AI</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get personalized recruitment assistance, candidate insights, and hiring recommendations powered by AI
              </p>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>Smart conversations</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Brain className="h-3 w-3" />
                  <span>AI-powered insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50/50 to-purple-50/50">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-white/20 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-xs text-gray-600">
                {messages.length > 0 ? `${messages.length} messages` : "Ready to help"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600">Online</span>
          </div>
        </div>
      </div>

      {/* Chat Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 pb-0 relative" ref={messagesContainerRef}>
        <div className="space-y-4">
          {historyLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
                <p className="text-sm text-gray-600">Loading conversation...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="space-y-4">
                <div className="relative mx-auto w-16 h-16">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-full h-full flex items-center justify-center">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 p-1 bg-yellow-400 rounded-full">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Welcome to AI Assistant</h3>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                    I'm here to help with your recruitment needs. Ask me about candidates, job postings, hiring strategies, or anything recruitment-related.
                  </p>
                </div>
                <div className="pt-4">
                  <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto">
                    <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20">
                      <div className="p-1.5 bg-blue-100 rounded">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-medium text-gray-900">Smart Conversations</p>
                        <p className="text-xs text-gray-600">Context-aware responses</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20">
                      <div className="p-1.5 bg-purple-100 rounded">
                        <Brain className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-medium text-gray-900">AI Insights</p>
                        <p className="text-xs text-gray-600">Data-driven recommendations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${message.role}-${index}-${message.created_at}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "bg-white/80 backdrop-blur-sm text-gray-900 border border-white/20 shadow-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          
          {sendMessage.isPending && (
            <div className="flex justify-start">
              <div className="bg-white/80 backdrop-blur-sm text-gray-900 max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl border border-white/20 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Scroll anchor for auto-scroll */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-white/20 rounded-full p-3 shadow-lg hover:bg-white/95 transition-all duration-200 hover:scale-105"
            title="Scroll to bottom"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Fixed Input Area */}
      <div className="flex-shrink-0 p-4 pt-0">
        {/* Suggestions */}
        {suggestions.length > 0 && messages.length === 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-3 font-medium">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex space-x-3">
          <Input
            placeholder="Ask me anything about recruitment..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-white/60 backdrop-blur-sm border-white/20 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20"
            disabled={sendMessage.isPending}
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            disabled={sendMessage.isPending || !inputValue.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-4 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {sendMessage.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
