import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  FileText,
  BarChart,
  FolderOpen,
  Clock,
  User,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

// Function to get user role - this would come from auth in a real app
const getUserRole = (): string => {
  return localStorage.getItem("userRole") || "employee";
};

// Function to get current check-in status
const getCheckinStatus = (): boolean => {
  return localStorage.getItem("checkedIn") === "true";
};

const Dashboard = () => {
  const userRole = getUserRole();
  const isCheckedIn = getCheckinStatus();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Your HR information at a glance</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Clock className="text-hr-primary mr-2" size={18} />
              Work Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status:</span>
                <span
                  className={`text-sm font-medium px-2 py-0.5 rounded-full ${isCheckedIn ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {isCheckedIn ? "Checked In" : "Checked Out"}
                </span>
              </div>
              {isCheckedIn && (
                <div className="text-xs text-slate-500">
                  Since: 09:00 AM Today
                </div>
              )}
              <Button
                variant={isCheckedIn ? "destructive" : "default"}
                size="sm"
                className="w-full mt-2"
              >
                {isCheckedIn ? "Check Out" : "Check In"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Calendar className="text-hr-primary mr-2" size={18} />
              Leave Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">15</div>
              <div className="text-sm text-slate-500">days remaining</div>
            </div>
            <Progress value={75} className="h-2 mt-2" />
            <div className="mt-3">
              <Link to="/leave">
                <Button variant="outline" size="sm" className="w-full">
                  Request Leave
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <FolderOpen className="text-hr-primary mr-2" size={18} />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Daily Report</span>
                <span className="text-red-500 font-medium">Due Today</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Performance Review</span>
                <span className="text-amber-500 font-medium">
                  Due in 3 days
                </span>
              </div>
              <Link to="/tasks">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-1 text-hr-primary"
                >
                  View All Tasks
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Bell className="text-hr-primary mr-2" size={18} />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="border-l-2 border-hr-primary pl-2 py-1">
                <p className="font-medium">Company Meeting</p>
                <p className="text-xs text-slate-500">Tomorrow at 10:00 AM</p>
              </div>
              <div className="border-l-2 border-slate-300 pl-2 py-1">
                <p className="font-medium">Leave Approved</p>
                <p className="text-xs text-slate-500">2 days ago</p>
              </div>
              <Link to="/notifications">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-1 text-hr-primary"
                >
                  View All
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Content - Different based on role */}
      {userRole === "hr" || userRole === "ceo" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
              <CardDescription>
                Employee distribution by department
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-slate-50 rounded-md">
              <div className="text-center text-slate-400">
                <BarChart size={40} className="mx-auto mb-2 opacity-50" />
                <p>Department Distribution Chart</p>
                <p className="text-xs">(Visualization would be here)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>Today's employee attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Present</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Work from Home</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Absent</span>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Leave</CardTitle>
              <CardDescription>Your scheduled time off</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Summer Vacation</p>
                    <p className="text-sm text-slate-500">
                      July 15 - July 22, 2025
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Personal Day</p>
                    <p className="text-sm text-slate-500">May 23, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Goals</CardTitle>
              <CardDescription>
                Progress towards your objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Customer Satisfaction
                    </span>
                    <span className="text-sm font-medium">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Project Completion
                    </span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Skills Development
                    </span>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Documents/Announcements */}
      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Documents & Announcements</CardTitle>
              <CardDescription>Latest files shared with you</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                <div className="flex items-center">
                  <FileText className="text-hr-secondary mr-3" size={20} />
                  <div>
                    <p className="font-medium">Employee Handbook 2025</p>
                    <p className="text-sm text-slate-500">
                      PDF • Added yesterday
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                <div className="flex items-center">
                  <Bell className="text-hr-secondary mr-3" size={20} />
                  <div>
                    <p className="font-medium">Company All-Hands Meeting</p>
                    <p className="text-sm text-slate-500">
                      Announcement • May 25, 2025
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                <div className="flex items-center">
                  <FileText className="text-hr-secondary mr-3" size={20} />
                  <div>
                    <p className="font-medium">Benefits Overview</p>
                    <p className="text-sm text-slate-500">
                      PDF • Added last week
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
