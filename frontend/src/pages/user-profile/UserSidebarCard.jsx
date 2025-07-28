import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const UserSidebarCard = ({ profile, loading }) => {
  if (loading) {
    return (
      <Card className="sticky top-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <Skeleton className="h-20 w-20 rounded-full mb-4" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
            <div className="mt-6 w-full space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-6">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={profile?.logo} alt="User" />
            <AvatarFallback>
              {profile?.firstName?.[0]}
              {profile?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <h2 className="font-bold text-xl">{`${profile?.firstName} ${profile?.lastName}`}</h2>
          <p className="text-slate-500 text-sm">{profile?.email}</p>
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
};

export default UserSidebarCard;
