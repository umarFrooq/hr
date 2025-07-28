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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Send, Clock, CheckCircle, XCircle } from "lucide-react";

const Requests = () => {
  const requests = [
    {
      id: 1,
      type: "Equipment Request",
      subject: "New Laptop Request",
      date: "2025-06-25",
      status: "Pending",
      priority: "High",
    },
    {
      id: 2,
      type: "IT Support",
      subject: "Email Access Issue",
      date: "2025-06-20",
      status: "Resolved",
      priority: "Medium",
    },
    {
      id: 3,
      type: "Facility",
      subject: "Office Key Card",
      date: "2025-06-18",
      status: "In Progress",
      priority: "Low",
    },
    {
      id: 4,
      type: "HR Request",
      subject: "Benefits Information",
      date: "2025-06-15",
      status: "Resolved",
      priority: "Medium",
    },
  ];

  const requestTypes = [
    "IT Support",
    "Equipment Request",
    "Facility Request",
    "HR Request",
    "Finance Request",
    "Other",
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Requests</h1>
        <p className="text-slate-500 mt-1">
          Submit and track your work requests
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Submit New Request</CardTitle>
            <CardDescription>
              Need help with something? Submit a request below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="request-type">Request Type</Label>
              <select
                id="request-type"
                className="w-full p-2 border border-slate-300 rounded-md"
              >
                <option value="">Select request type...</option>
                {requestTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your request"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                className="w-full p-2 border border-slate-300 rounded-md"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about your request..."
                rows={4}
              />
            </div>

            <Button className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Statistics</CardTitle>
            <CardDescription>Your request activity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-slate-600">Total Requests</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-slate-600">Resolved</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <div className="text-sm text-slate-600">In Progress</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-600">2</div>
                <div className="text-sm text-slate-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
          <CardDescription>
            Track the status of your submitted requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-800">
                      {request.subject}
                    </p>
                    <p className="text-sm text-slate-500">
                      {request.type} • {request.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      request.priority === "High" ||
                      request.priority === "Urgent"
                        ? "destructive"
                        : request.priority === "Medium"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {request.priority}
                  </Badge>

                  <div className="flex items-center space-x-2">
                    {getStatusIcon(request.status)}
                    <span className="text-sm font-medium">
                      {request.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Requests;
