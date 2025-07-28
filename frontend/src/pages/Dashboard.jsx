import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Dashboard = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Team Meeting",
      time: "10:00 AM",
      date: "Today",
      type: "meeting",
    },
    {
      id: 2,
      title: "Performance Review",
      time: "2:00 PM",
      date: "Tomorrow",
      type: "review",
    },
    {
      id: 3,
      title: "Training Session",
      time: "9:00 AM",
      date: "Friday",
      type: "training",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Submitted timesheet",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      action: "Updated profile information",
      time: "1 day ago",
      status: "completed",
    },
    {
      id: 3,
      action: "Requested vacation leave",
      time: "3 days ago",
      status: "pending",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome back, John!
        </h1>
        <p className="text-slate-500 mt-1">
          Here's what's happening with your work today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hours This Week
            </CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.5</div>
            <p className="text-xs text-slate-500">+2.5 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <Calendar className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-slate-500">Days remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,250</div>
            <p className="text-xs text-slate-500">Gross salary</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-slate-500">Direct reports</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Your schedule for the next few days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-800">{event.title}</p>
                    <p className="text-sm text-slate-500">
                      {event.date} at {event.time}
                    </p>
                  </div>
                  <Badge
                    variant={event.type === "meeting" ? "default" : "secondary"}
                  >
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Full Calendar
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1">
                    {activity.status === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Log Time</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Request Leave</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm">View Payslip</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">Team Directory</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
