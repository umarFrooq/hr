import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Calendar,
  FileText,
  Globe,
  Info,
  Search,
  Star,
} from "lucide-react";

// Mock data for announcements
const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Company All-Hands Meeting - Q2 2025",
    date: "2025-05-25",
    content:
      "Please join us for our quarterly all-hands meeting where we will discuss company updates, achievements, and upcoming plans. The meeting will be held in the main conference room and remotely via Teams.",
    category: "meeting",
    important: true,
    attachment: "all-hands-agenda.pdf",
  },
  {
    id: 2,
    title: "Office Closure - Memorial Day",
    date: "2025-05-22",
    content:
      "Please note that our office will be closed on Monday, May 26th, 2025 in observance of Memorial Day. Normal operations will resume on Tuesday, May 27th, 2025.",
    category: "holiday",
    important: true,
    attachment: "2025-holiday-calendar.pdf",
  },
  {
    id: 3,
    title: "Annual Health Insurance Enrollment",
    date: "2025-05-15",
    content:
      "The annual health insurance enrollment period begins on June 1st, 2025. Please review your options and make any changes before June 30th, 2025. Contact HR for more information.",
    category: "benefits",
    important: false,
    attachment: "health-insurance-options.pdf",
  },
  {
    id: 4,
    title: "New Learning Management System",
    date: "2025-05-10",
    content:
      "We're excited to announce the launch of our new Learning Management System. All employees will receive an email with login credentials and instructions on how to access the platform.",
    category: "it",
    important: false,
    attachment: "lms-guide.pdf",
  },
  {
    id: 5,
    title: "Office Renovation Schedule",
    date: "2025-05-05",
    content:
      "The third floor renovation will take place from June 15th to July 15th, 2025. During this time, third floor teams will be temporarily relocated to the second floor. Please see the attached seating chart.",
    category: "facilities",
    important: true,
    attachment: "seating-chart.pdf",
  },
];

const Announcements = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showImportantOnly, setShowImportantOnly] = useState(false);

  // Filter announcements based on search, category, and importance
  const filteredAnnouncements = ANNOUNCEMENTS.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || announcement.category === selectedCategory;
    const matchesImportance = !showImportantOnly || announcement.important;

    return matchesSearch && matchesCategory && matchesImportance;
  });

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "meeting":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "holiday":
        return <Calendar className="h-5 w-5 text-green-500" />;
      case "benefits":
        return <FileText className="h-5 w-5 text-purple-500" />;
      case "it":
        return <Globe className="h-5 w-5 text-slate-500" />;
      case "facilities":
        return <Info className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-hr-primary" />;
    }
  };

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      meeting: "Meetings",
      holiday: "Holidays",
      benefits: "Benefits",
      it: "IT & Systems",
      facilities: "Facilities",
    };
    return categories[category] || "General";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      meeting: "bg-blue-100 text-blue-800",
      holiday: "bg-green-100 text-green-800",
      benefits: "bg-purple-100 text-purple-800",
      it: "bg-slate-100 text-slate-800",
      facilities: "bg-amber-100 text-amber-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const uniqueCategories = Array.from(
    new Set(ANNOUNCEMENTS.map((a) => a.category)),
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Announcements</h1>
        <p className="text-slate-500 mt-1">
          Stay updated with company news and information
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search announcements..."
            className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>

          {uniqueCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={
                selectedCategory === category ? "" : getCategoryColor(category)
              }
              onClick={() =>
                setSelectedCategory(
                  category === selectedCategory ? null : category,
                )
              }
            >
              {getCategoryName(category)}
            </Button>
          ))}

          <Button
            variant={showImportantOnly ? "default" : "outline"}
            size="sm"
            className={
              showImportantOnly
                ? ""
                : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
            }
            onClick={() => setShowImportantOnly(!showImportantOnly)}
          >
            <Star
              className={`h-4 w-4 ${showImportantOnly ? "mr-1" : "mr-1 text-red-500"}`}
            />
            Important Only
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-medium text-slate-600">
                No announcements found
              </h3>
              <p className="text-slate-400">
                Try changing your search or filter criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <Card
              key={announcement.id}
              className={
                announcement.important ? "border-l-4 border-l-red-500" : ""
              }
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getCategoryIcon(announcement.category)}
                    </div>
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {announcement.title}
                        {announcement.important && (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        )}
                      </CardTitle>
                      <div className="flex items-center mt-1 text-sm text-slate-500 gap-3">
                        <span>{formatDate(announcement.date)}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(announcement.category)}`}
                        >
                          {getCategoryName(announcement.category)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">{announcement.content}</p>
                {announcement.attachment && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-hr-primary" />
                    <span className="text-sm text-hr-primary">
                      {announcement.attachment}
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Download
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
