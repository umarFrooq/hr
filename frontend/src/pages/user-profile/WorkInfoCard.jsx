import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";

const WorkInfoCard = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="text-sm font-medium text-slate-500">Department</div>
            <div>{user?.organizationData?.department ?? "N/A"}</div>
            <div className="text-sm font-medium text-slate-500">Position</div>
            <div>{user?.organizationData?.position ?? "N/A"}</div>
            <div className="text-sm font-medium text-slate-500">
              Employee ID
            </div>
            <div>{user?.employeeId ?? "N/A"}</div>
            <div className="text-sm font-medium text-slate-500">
              Start Date
            </div>
            <div>
              {user?.joiningDate
                ? new Date(user.joiningDate).toLocaleDateString()
                : "N/A"}
            </div>
            <div className="text-sm font-medium text-slate-500">
              Reports To
            </div>
            <div>Sarah Johnson (Engineering Manager)</div>
            <div className="text-sm font-medium text-slate-500">Salary</div>
            <div>{user?.salary ? `$${user.salary}` : "N/A"}</div>
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
};

export default WorkInfoCard;
