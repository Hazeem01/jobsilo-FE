import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";

const Interviews = () => (
  <>
    <RoleBasedNavigation />
    <div className="container mx-auto py-8">
      <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#222327]">
            <Calendar className="h-5 w-5 text-[#FF7C23]" />
            <span>Interview Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#2D3559]">
            Schedule and manage interviews with candidates. This feature will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  </>
);

export default Interviews; 