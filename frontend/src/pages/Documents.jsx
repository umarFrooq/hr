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
import { Input } from "@/components/ui/input";
import { FileText, Download, Upload, Search, FolderOpen } from "lucide-react";

const Documents = () => {
  const documents = [
    {
      id: 1,
      name: "Employee Handbook.pdf",
      type: "Policy",
      size: "2.5 MB",
      date: "2025-01-15",
      category: "HR",
    },
    {
      id: 2,
      name: "Tax Form W-2.pdf",
      type: "Tax Document",
      size: "0.8 MB",
      date: "2025-01-31",
      category: "Finance",
    },
    {
      id: 3,
      name: "Performance Review Q1.pdf",
      type: "Review",
      size: "1.2 MB",
      date: "2025-03-31",
      category: "Performance",
    },
    {
      id: 4,
      name: "Benefits Summary.pdf",
      type: "Benefits",
      size: "3.1 MB",
      date: "2025-01-01",
      category: "HR",
    },
    {
      id: 5,
      name: "Training Certificate.pdf",
      type: "Certificate",
      size: "0.5 MB",
      date: "2025-02-15",
      category: "Training",
    },
    {
      id: 6,
      name: "Contract Amendment.pdf",
      type: "Contract",
      size: "1.8 MB",
      date: "2025-01-10",
      category: "Legal",
    },
  ];

  const categories = [
    "All",
    "HR",
    "Finance",
    "Performance",
    "Training",
    "Legal",
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Documents</h1>
        <p className="text-slate-500 mt-1">
          Access and manage your work documents
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input placeholder="Search documents..." className="pl-10" />
          </div>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button key={category} variant="outline" size="sm">
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <FileText className="h-8 w-8 text-blue-500" />
                <Badge variant="secondary">{doc.category}</Badge>
              </div>
              <CardTitle className="text-base">{doc.name}</CardTitle>
              <CardDescription>{doc.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{doc.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{doc.date}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <FolderOpen className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Documents;
