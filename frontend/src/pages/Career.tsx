import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ExternalLink,
  FileText,
  Search,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for job openings
const JOB_OPENINGS = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "New York, NY (Hybrid)",
    type: "Full-time",
    posted: "2025-05-15",
    description:
      "We're looking for an experienced Frontend Developer proficient in React, TypeScript, and modern web technologies to join our growing team.",
    requirements: [
      "5+ years of experience with React and modern JavaScript",
      "Strong knowledge of TypeScript",
      "Experience with state management libraries",
      "Good understanding of responsive design principles",
      "Bachelor's degree in Computer Science or related field",
    ],
  },
  {
    id: 2,
    title: "UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    posted: "2025-05-12",
    description:
      "Join our design team to create beautiful, intuitive user experiences across our product suite.",
    requirements: [
      "3+ years of UX/UI design experience",
      "Proficiency with design tools like Figma, Sketch",
      "Experience conducting user research",
      "Portfolio demonstrating design thinking",
      "Excellent communication skills",
    ],
  },
  {
    id: 3,
    title: "Data Analyst",
    department: "Analytics",
    location: "San Francisco, CA (On-site)",
    type: "Full-time",
    posted: "2025-05-10",
    description:
      "We're seeking a data analyst to help transform our data into insights and drive business decisions.",
    requirements: [
      "Experience with SQL and data visualization tools",
      "Understanding of statistical analysis",
      "Proficiency in Python or R",
      "Background in business intelligence",
      "Strong problem-solving abilities",
    ],
  },
  {
    id: 4,
    title: "Marketing Coordinator",
    department: "Marketing",
    location: "Chicago, IL (Hybrid)",
    type: "Full-time",
    posted: "2025-05-05",
    description:
      "Support our marketing team in campaign execution, content creation, and performance tracking.",
    requirements: [
      "1-3 years of marketing experience",
      "Familiarity with digital marketing channels",
      "Strong writing and communication skills",
      "Experience with marketing automation tools",
      "Bachelor's degree in Marketing or related field",
    ],
  },
  {
    id: 5,
    title: "Customer Success Manager",
    department: "Customer Support",
    location: "Remote",
    type: "Full-time",
    posted: "2025-04-30",
    description:
      "Build and maintain strong relationships with our customers to ensure their success using our products.",
    requirements: [
      "3+ years in customer success or account management",
      "Strong interpersonal and communication skills",
      "Experience in SaaS environment",
      "Problem-solving mindset",
      "Bachelor's degree or equivalent experience",
    ],
  },
];

// Mock data for learning resources
const LEARNING_RESOURCES = [
  {
    id: 1,
    title: "Introduction to Leadership",
    category: "Management",
    type: "Course",
    duration: "4 hours",
    provider: "Company Learning Hub",
    link: "#",
  },
  {
    id: 2,
    title: "Advanced Excel for Business Analytics",
    category: "Technical Skills",
    type: "Workshop",
    duration: "2 hours",
    provider: "LinkedIn Learning",
    link: "#",
  },
  {
    id: 3,
    title: "Effective Communication Strategies",
    category: "Soft Skills",
    type: "Course",
    duration: "3 hours",
    provider: "Udemy",
    link: "#",
  },
  {
    id: 4,
    title: "Project Management Essentials",
    category: "Management",
    type: "Certification",
    duration: "8 hours",
    provider: "PMI",
    link: "#",
  },
];

// Mock data for upcoming events
const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "Leadership Summit 2025",
    date: "2025-06-15",
    time: "9:00 AM - 5:00 PM",
    location: "Company HQ, 10th Floor",
    description:
      "Annual leadership conference for developing management skills.",
  },
  {
    id: 2,
    title: "Tech Talk: AI in Business",
    date: "2025-05-30",
    time: "2:00 PM - 3:30 PM",
    location: "Virtual (Zoom)",
    description:
      "Learn about the latest AI applications for business operations.",
  },
  {
    id: 3,
    title: "New Employee Orientation",
    date: "2025-06-01",
    time: "10:00 AM - 12:00 PM",
    location: "Training Room A",
    description: "Welcome session for all new employees joining in June.",
  },
];

const Career = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const filteredJobs = JOB_OPENINGS.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Career Portal</h1>
        <p className="text-slate-500 mt-1">
          Explore job opportunities, learning resources, and career events
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-hr-primary" />
                Job Openings
              </CardTitle>
              <CardDescription>
                Current opportunities within the company
              </CardDescription>
              <div className="relative mt-2">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search positions, departments, or locations..."
                  className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredJobs.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-500">
                    No job openings found matching your search criteria.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <Card
                      key={job.id}
                      className={`border ${selectedJob === job.id ? "border-hr-primary" : ""}`}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {job.type}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>Posted: {formatDate(job.posted)}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm mb-3">{job.description}</p>
                        {selectedJob === job.id && (
                          <div className="mt-2">
                            <h4 className="text-sm font-medium mb-2">
                              Requirements:
                            </h4>
                            <ul className="text-sm list-disc pl-5 space-y-1">
                              {job.requirements.map((req, idx) => (
                                <li key={idx}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="flex justify-end mt-2">
                          {selectedJob === job.id ? (
                            <div className="space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedJob(null)}
                              >
                                Close
                              </Button>
                              <Button size="sm">
                                Apply Now
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedJob(job.id)}
                            >
                              View Details
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-hr-primary" />
                Upcoming Career Events
              </CardTitle>
              <CardDescription>
                Workshops, trainings, and networking opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {UPCOMING_EVENTS.map((event) => (
                  <div
                    key={event.id}
                    className="flex gap-4 p-3 bg-slate-50 rounded-md"
                  >
                    <div className="min-w-[60px] text-center">
                      <div className="font-bold text-hr-primary">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs">
                        {new Date(event.date).toLocaleString("default", {
                          month: "short",
                        })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="text-sm text-slate-500 mt-1">
                        <div>{event.time}</div>
                        <div>{event.location}</div>
                      </div>
                      <p className="text-sm mt-2">{event.description}</p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        RSVP
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-hr-primary" />
                Learning Resources
              </CardTitle>
              <CardDescription>
                Professional development opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {LEARNING_RESOURCES.map((resource) => (
                  <div
                    key={resource.id}
                    className="border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <h3 className="font-medium">{resource.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {resource.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <div className="text-slate-500">
                        {resource.duration} • {resource.provider}
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 gap-1">
                        Access <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Learning Resources
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Career Resources</CardTitle>
              <CardDescription>Tools to help your growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" /> Career Path Guidelines
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" /> Resume Templates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" /> Interview Preparation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" /> Skill Assessment Tools
                </Button>
              </div>
              <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
                <p className="font-medium">Need career advice?</p>
                <p className="mt-1">
                  Schedule a meeting with HR to discuss your career growth
                  opportunities.
                </p>
                <Button className="mt-3 w-full bg-blue-600 hover:bg-blue-700">
                  Schedule Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Career;
