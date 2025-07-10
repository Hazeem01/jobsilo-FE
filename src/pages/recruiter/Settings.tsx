import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";

const Settings = () => (
  <>
    <RoleBasedNavigation />
    <div className="container mx-auto py-8">
      <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#222327]">
            <SettingsIcon className="h-5 w-5 text-[#2D3559]" />
            <span>Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#2D3559]">
            Update your recruiter preferences here. (Settings UI coming soon)
          </p>
        </CardContent>
      </Card>
    </div>
  </>
);

export default Settings; 