import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const WorkInfoCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Work Information</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="text-sm font-medium text-slate-500">Department</div>
          <div>Engineering</div>
          <div className="text-sm font-medium text-slate-500">Position</div>
          <div>Senior Software Engineer</div>
          <div className="text-sm font-medium text-slate-500">Employee ID</div>
          <div>EMP-2023-0042</div>
          <div className="text-sm font-medium text-slate-500">Start Date</div>
          <div>March 15, 2023</div>
          <div className="text-sm font-medium text-slate-500">Reports To</div>
          <div>Sarah Johnson (Engineering Manager)</div>
          <div className="text-sm font-medium text-slate-500">
            Office Location
          </div>
          <div>New York - Main Office (4th Floor)</div>
          <div className="text-sm font-medium text-slate-500">
            Work Schedule
          </div>
          <div>Monday - Friday, 9:00 AM - 5:00 PM</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default WorkInfoCard;
