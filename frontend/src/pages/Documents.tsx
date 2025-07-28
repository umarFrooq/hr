import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, File, FileText, Search, Upload } from "lucide-react";

// Sample document data
const PERSONAL_DOCUMENTS = [
  {
    id: 1,
    name: "Employment Contract",
    type: "PDF",
    size: "1.2 MB",
    date: "Jan 15, 2023",
    category: "Contract",
  },
  {
    id: 2,
    name: "Tax Declaration Form",
    type: "PDF",
    size: "430 KB",
    date: "Feb 28, 2025",
    category: "Tax",
  },
  {
    id: 3,
    name: "Performance Review Q4 2024",
    type: "PDF",
    size: "650 KB",
    date: "Dec 15, 2024",
    category: "Performance",
  },
  {
    id: 4,
    name: "Health Insurance Card",
    type: "JPG",
    size: "2.1 MB",
    date: "Mar 10, 2024",
    category: "Benefits",
  },
  {
    id: 5,
    name: "Training Certificate - Leadership",
    type: "PDF",
    size: "1.5 MB",
    date: "Nov 05, 2024",
    category: "Training",
  },
];

const COMPANY_DOCUMENTS = [
  {
    id: 1,
    name: "Employee Handbook 2025",
    type: "PDF",
    size: "3.2 MB",
    date: "Jan 05, 2025",
    category: "Policy",
  },
  {
    id: 2,
    name: "Benefits Overview",
    type: "PDF",
    size: "1.8 MB",
    date: "Feb 12, 2025",
    category: "Benefits",
  },
  {
    id: 3,
    name: "Health and Safety Guidelines",
    type: "PDF",
    size: "2.4 MB",
    date: "Mar 01, 2025",
    category: "Policy",
  },
  {
    id: 4,
    name: "Company Holiday Calendar 2025",
    type: "PDF",
    size: "1.1 MB",
    date: "Dec 20, 2024",
    category: "Calendar",
  },
  {
    id: 5,
    name: "Remote Work Policy",
    type: "PDF",
    size: "950 KB",
    date: "Jan 15, 2025",
    category: "Policy",
  },
  {
    id: 6,
    name: "Quarterly Newsletter Q1 2025",
    type: "PDF",
    size: "4.5 MB",
    date: "Mar 30, 2025",
    category: "Newsletter",
  },
  {
    id: 7,
    name: "Travel Expense Policy",
    type: "PDF",
    size: "1.3 MB",
    date: "Feb 10, 2025",
    category: "Policy",
  },
];

const DocumentCard = ({ document }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-hr-light p-2 rounded-lg mr-3">
            <FileText className="h-6 w-6 text-hr-primary" />
          </div>
          <div>
            <h3 className="font-medium text-slate-800">{document.name}</h3>
            <div className="flex items-center text-xs text-slate-500 mt-1">
              <span className="mr-3">
                {document.type} • {document.size}
              </span>
              <span>{document.date}</span>
            </div>
          </div>
        </div>
        <div>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="border-t px-4 py-2 bg-slate-50 flex justify-between items-center">
        <span className="text-xs font-medium text-slate-600">
          {document.category}
        </span>
        <Button variant="link" size="sm" className="text-xs p-0 h-auto">
          View
        </Button>
      </div>
    </div>
  );
};

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPersonalDocs = PERSONAL_DOCUMENTS.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredCompanyDocs = COMPANY_DOCUMENTS.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Document Management
        </h1>
        <p className="text-slate-500 mt-1">Access and manage your documents</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-2 max-w-[400px] mb-6">
          <TabsTrigger value="personal">Personal Documents</TabsTrigger>
          <TabsTrigger value="company">Company Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          {filteredPersonalDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPersonalDocs.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <File className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 text-center">
                  No documents found matching your search.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          {filteredCompanyDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCompanyDocs.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <File className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 text-center">
                  No documents found matching your search.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documents;
