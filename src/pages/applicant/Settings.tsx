import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Download,
  Upload,
  Eye,
  EyeOff
} from "lucide-react";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();

  return (
    <>
      <RoleBasedNavigation />
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 text-[#222327]">
          <SettingsIcon className="h-6 w-6 text-[#2D3559]" />
          <span>Settings</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#222327]">
                <User className="h-5 w-5 text-[#2D3559]" />
                <span>Profile Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-[#222327]">First Name</Label>
                  <Input id="firstName" defaultValue={user?.firstName} className="focus:ring-[#2D3559] focus:border-[#2D3559]" />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-[#222327]">Last Name</Label>
                  <Input id="lastName" defaultValue={user?.lastName} className="focus:ring-[#2D3559] focus:border-[#2D3559]" />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-[#222327]">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} className="focus:ring-[#2D3559] focus:border-[#2D3559]" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-[#222327]">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" className="focus:ring-[#2D3559] focus:border-[#2D3559]" />
              </div>
              <Button className="w-full bg-gradient-to-r from-[#2D3559] to-[#FF7C23] hover:from-[#1a1f2e] hover:to-[#e65a1a] text-white transition-all duration-300">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#222327]">
                <Bell className="h-5 w-5 text-[#A3D958]" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#222327]">Email Notifications</p>
                  <p className="text-sm text-[#2D3559]">Receive updates about your applications</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#222327]">Job Alerts</p>
                  <p className="text-sm text-[#2D3559]">Get notified about new matching jobs</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#222327]">Interview Reminders</p>
                  <p className="text-sm text-[#2D3559]">Reminders for upcoming interviews</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#222327]">Application Updates</p>
                  <p className="text-sm text-[#2D3559]">Status changes for your applications</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#222327]">
                <Shield className="h-5 w-5 text-[#FF7C23]" />
                <span>Privacy & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-[#222327]">Current Password</Label>
                <Input id="currentPassword" type="password" className="focus:ring-[#2D3559] focus:border-[#2D3559]" />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-[#222327]">New Password</Label>
                <Input id="newPassword" type="password" className="focus:ring-[#2D3559] focus:border-[#2D3559]" />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-[#222327]">Confirm Password</Label>
                <Input id="confirmPassword" type="password" className="focus:ring-[#2D3559] focus:border-[#2D3559]" />
              </div>
              <Button variant="outline" className="w-full hover:bg-[#2D3559]/10 hover:text-[#2D3559] transition-all duration-300">
                Change Password
              </Button>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#222327]">Two-Factor Authentication</p>
                  <p className="text-sm text-[#2D3559]">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Appearance & Preferences */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#222327]">
                <Palette className="h-5 w-5 text-[#2D3559]" />
                <span>Appearance & Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#222327]">Dark Mode</p>
                  <p className="text-sm text-[#2D3559]">Switch to dark theme</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#222327]">Auto-save Documents</p>
                  <p className="text-sm text-[#2D3559]">Automatically save your work</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#222327]">Show AI Suggestions</p>
                  <p className="text-sm text-[#2D3559]">Display AI-powered recommendations</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1 hover:bg-[#2D3559]/10 hover:text-[#2D3559] transition-all duration-300">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="flex-1 hover:bg-[#2D3559]/10 hover:text-[#2D3559] transition-all duration-300">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Settings; 