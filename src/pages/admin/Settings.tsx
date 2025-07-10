import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Database, Shield, Bell, Globe } from "lucide-react";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";

const Settings = () => (
  <>
    <RoleBasedNavigation />
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 text-[#222327]">
        <SettingsIcon className="h-6 w-6 text-[#2D3559]" />
        <span>Admin Settings</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#222327]">
              <Database className="h-5 w-5 text-[#2D3559]" />
              <span>System Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#2D3559]">
              Configure system-wide settings, database connections, and performance parameters.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#222327]">
              <Shield className="h-5 w-5 text-[#A3D958]" />
              <span>Security Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#2D3559]">
              Manage authentication, permissions, and security policies for the platform.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#222327]">
              <Bell className="h-5 w-5 text-[#FF7C23]" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#2D3559]">
              Configure email notifications, alerts, and system-wide communication settings.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#222327]">
              <Globe className="h-5 w-5 text-[#2D3559]" />
              <span>Platform Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#2D3559]">
              Manage branding, appearance, and platform-wide configuration options.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </>
);

export default Settings; 