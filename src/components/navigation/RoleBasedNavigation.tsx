import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminNavigation from "./AdminNavigation";
import RecruiterNavigation from "./RecruiterNavigation";
import ApplicantNavigation from "./ApplicantNavigation";
import { Navigation } from "../Navigation";

const RoleBasedNavigation = (props: any) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Show default navigation for guests
    return <Navigation {...props} />;
  }

  switch (user?.role) {
    case "admin":
      return <AdminNavigation {...props} />;
    case "recruiter":
      return <RecruiterNavigation {...props} />;
    case "applicant":
      return <ApplicantNavigation {...props} />;
    default:
      return <Navigation {...props} />;
  }
};

export default RoleBasedNavigation; 