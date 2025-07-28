import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Speaker,
  Calendar,
  Users,
  AlertTriangle,
  Info,
  Megaphone,
} from "lucide-react";

const Announcements = () => {
  const announcements = [
    {
      id: 1,
      title: "Company All-Hands Meeting",
      content:
        "Join us for our quarterly all-hands meeting on Friday, July 5th at 2:00 PM in the main conference room. We'll be discussing Q2 results and Q3 planning.",
      type: "Meeting",
      priority: "High",
      date: "2025-06-28",
      author: "Sarah Johnson, CEO",
      read: false,
    },
    {
      id: 2,
      title: "New Benefits Package Available",
      content:
        "We're excited to announce improvements to our benefits package, including enhanced dental coverage and flexible work arrangements. Details will be sent via email.",
      type: "Benefits",
      priority: "Medium",
      date: "2025-06-25",
      author: "HR Department",
      read: true,
    },
    {
      id: 3,
      title: "Office WiFi Maintenance",
      content:
        "The office WiFi will undergo scheduled maintenance this Saturday from 6:00 AM to 8:00 AM. Please plan accordingly for any weekend work.",
      type: "IT",
      priority: "Low",
      date: "2025-06-22",
      author: "IT Support",
      read: true,
    },
    {
      id: 4,
      title: "Employee Recognition Program Launch",
      content:
        "We're launching a new employee recognition program! Nominate your colleagues for outstanding work and contributions. More details coming soon.",
      type: "HR",
      priority: "Medium",
      date: "2025-06-20",
      author: "People Operations",
      read: false,
    },
    {
      id: 5,
      title: "Security Protocol Update",
      content:
        "Important security updates have been implemented. Please ensure you're using the latest version of our VPN client and update your passwords.",
      type: "Security",
      priority: "High",
      date: "2025-06-18",
      author: "Security Team",
      read: true,
    },
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case "Meeting":
        return <Calendar className="h-4 w-4" />;
      case "Security":
        return <AlertTriangle className="h-4 w-4" />;
      case "IT":
        return <Info className="h-4 w-4" />;
      default:
        return <Megaphone className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Announcements</h1>
        <p className="text-slate-500 mt-1">
          Stay updated with company news and important information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Announcements
            </CardTitle>
            <Speaker className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <p className="text-xs text-slate-500">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertTriangle className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter((a) => !a.read).length}
            </div>
            <p className="text-xs text-slate-500">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter((a) => a.priority === "High").length}
            </div>
            <p className="text-xs text-slate-500">Important updates</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card
            key={announcement.id}
            className={`${!announcement.read ? "border-blue-200 bg-blue-50/30" : ""}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(announcement.type)}
                  <CardTitle className="text-lg">
                    {announcement.title}
                  </CardTitle>
                  {!announcement.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getPriorityColor(announcement.priority)}>
                    {announcement.priority}
                  </Badge>
                  <Badge variant="outline">{announcement.type}</Badge>
                </div>
              </div>
              <CardDescription>
                By {announcement.author} • {announcement.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">{announcement.content}</p>
              <div className="flex space-x-2">
                {!announcement.read && (
                  <Button variant="outline" size="sm">
                    Mark as Read
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
