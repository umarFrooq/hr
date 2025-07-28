import { Link } from "react-router-dom";
import { ShieldX, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <ShieldX className="h-24 w-24 text-destructive mx-auto" />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Access Denied</h1>
          <p className="text-lg text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            This page requires specific user roles or permissions that your
            account doesn't have. Please contact your administrator if you
            believe this is an error.
          </p>

          <Link to="/dashboard">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
