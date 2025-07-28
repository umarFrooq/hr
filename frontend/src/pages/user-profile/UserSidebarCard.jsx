import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserSidebarCard = () => (
  <Card className="sticky top-6">
    <CardContent className="pt-6">
      <div className="flex flex-col items-center">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <h2 className="font-bold text-xl">John Doe</h2>
        <p className="text-slate-500 text-sm">Senior Software Engineer</p>
        <div className="mt-6 w-full space-y-2">
          <Button variant="outline" className="w-full justify-start">
            View Public Profile
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {}}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default UserSidebarCard;
