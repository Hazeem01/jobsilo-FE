import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users as UsersIcon, Shield } from "lucide-react";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock user data - replace with real API call
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "recruiter", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "applicant", status: "active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "admin", status: "active" },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="secondary" className="bg-[#FF7C23]/10 text-[#FF7C23]">Admin</Badge>;
      case "recruiter":
        return <Badge variant="secondary" className="bg-[#A3D958]/10 text-[#A3D958]">Recruiter</Badge>;
      case "applicant":
        return <Badge variant="secondary" className="bg-[#2D3559]/10 text-[#2D3559]">Applicant</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  return (
    <>
      <RoleBasedNavigation />
      <div className="container mx-auto py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
          <h2 className="text-2xl font-bold flex items-center space-x-2 text-[#222327]">
            <UsersIcon className="h-6 w-6 text-[#2D3559]" />
            <span>User Management</span>
          </h2>
          <Badge variant="secondary" className="bg-[#2D3559]/10 text-[#2D3559] text-xs">
            Admin View
          </Badge>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D3559] h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 backdrop-blur-sm border-white/20 text-sm focus:ring-[#2D3559] focus:border-[#2D3559]"
            />
          </div>
        </div>
        <div className="grid gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Card key={user.id} className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#2D3559] to-[#FF7C23] rounded-full flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#222327]">{user.name}</h3>
                        <p className="text-sm text-[#2D3559]">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getRoleBadge(user.role)}
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="pt-6">
                <p className="text-[#2D3559] text-center">
                  {searchTerm ? "No users found matching your search." : "No users available."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Users; 