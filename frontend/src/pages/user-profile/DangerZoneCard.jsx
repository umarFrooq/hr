import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DangerZoneCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-red-600">Danger Zone</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-slate-600 mb-4">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <Button variant="destructive">Delete Account</Button>
    </CardContent>
  </Card>
);

export default DangerZoneCard;
