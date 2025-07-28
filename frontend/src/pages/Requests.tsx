import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Check, Clock, File, Mail, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data for previous requests
const PREVIOUS_REQUESTS = [
  {
    id: 1,
    type: "Equipment Request",
    subject: "New Monitor",
    date: "2025-05-15",
    status: "Approved",
  },
  {
    id: 2,
    type: "Certificate",
    subject: "Employment Certificate",
    date: "2025-05-10",
    status: "Completed",
  },
  {
    id: 3,
    type: "Other",
    subject: "Parking Space Request",
    date: "2025-05-05",
    status: "Pending",
  },
  {
    id: 4,
    type: "Software Access",
    subject: "Adobe Creative Cloud",
    date: "2025-05-01",
    status: "Rejected",
  },
];

const Requests = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    requestType: "",
    subject: "",
    description: "",
    urgency: "medium",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "Request Submitted",
      description: "Your request has been submitted successfully.",
      duration: 5000,
    });

    // Reset form
    setFormData({
      requestType: "",
      subject: "",
      description: "",
      urgency: "medium",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            {status}
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            {status}
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Check className="h-3 w-3 mr-1" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Requests</h1>
        <p className="text-slate-500 mt-1">Submit and manage your requests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>New Request</CardTitle>
              <CardDescription>
                Fill out the form to submit a new request
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestType">Request Type</Label>
                    <Select
                      value={formData.requestType}
                      onValueChange={(value) =>
                        handleSelectChange("requestType", value)
                      }
                    >
                      <SelectTrigger id="requestType">
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="certificate">
                          Certificate Request
                        </SelectItem>
                        <SelectItem value="equipment">
                          Equipment Request
                        </SelectItem>
                        <SelectItem value="software">
                          Software Access
                        </SelectItem>
                        <SelectItem value="leave">Special Leave</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) =>
                        handleSelectChange("urgency", value)
                      }
                    >
                      <SelectTrigger id="urgency">
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief subject of your request"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide details about your request"
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachment">Attachment (optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="attachment"
                      type="file"
                      className="cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Maximum file size: 5MB. Supported formats: PDF, DOC, DOCX,
                    JPG, PNG
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto">
                  Submit Request <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Quick Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <File className="mr-2 h-4 w-4" />
                Request Employment Certificate
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <File className="mr-2 h-4 w-4" />
                Request Salary Certificate
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <File className="mr-2 h-4 w-4" />
                Equipment Repair
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <File className="mr-2 h-4 w-4" />
                Software Installation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Previous Requests</CardTitle>
          <CardDescription>History of your submitted requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PREVIOUS_REQUESTS.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.subject}</TableCell>
                  <TableCell>
                    {new Date(request.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Requests;
