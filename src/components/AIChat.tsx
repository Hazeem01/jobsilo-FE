
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Bot } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI recruitment assistant. I can help you find the best candidates, analyze resumes, and optimize your job postings. What would you like to do today?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: getAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("candidate") || lowerMessage.includes("find")) {
      return "I've analyzed your requirements and found 3 highly qualified candidates with 90%+ match scores. Sarah Johnson stands out with her React and TypeScript expertise. Would you like me to schedule interviews?";
    }
    
    if (lowerMessage.includes("job") || lowerMessage.includes("post")) {
      return "I can help optimize your job posting for better candidate attraction. Based on market data, I recommend highlighting remote work options and competitive salary ranges. Shall I analyze your current posting?";
    }
    
    if (lowerMessage.includes("interview") || lowerMessage.includes("schedule")) {
      return "I've identified optimal interview time slots based on candidate availability and your calendar. I can also generate tailored interview questions based on the role requirements. What would you prefer?";
    }
    
    return "I understand you're looking for recruitment assistance. I can help with candidate matching, job posting optimization, interview scheduling, and market insights. What specific area would you like to focus on?";
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20 h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <span>AI Assistant</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
            Online
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Input
            placeholder="Ask me anything about recruitment..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-white/50 backdrop-blur-sm border-white/20"
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
