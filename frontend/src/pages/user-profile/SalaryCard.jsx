import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserProfile } from "@/hooks/useUserProfile";

const SalaryCard = () => {
  const { profile } = useUserProfile();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Information</CardTitle>
        <CardDescription>Your salary details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="salary">Salary</Label>
          <Input id="salary" value={profile?.salary || ""} readOnly />
        </div>
      </CardContent>
    </Card>
  );
};

export default SalaryCard;
