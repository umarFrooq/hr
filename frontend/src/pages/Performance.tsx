import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PERFORMANCE_DATA = [
  { month: "Jan", score: 75 },
  { month: "Feb", score: 78 },
  { month: "Mar", score: 82 },
  { month: "Apr", score: 80 },
  { month: "May", score: 85 },
  { month: "Jun", score: 83 },
  { month: "Jul", score: 87 },
  { month: "Aug", score: 86 },
  { month: "Sep", score: 90 },
  { month: "Oct", score: 88 },
  { month: "Nov", score: 91 },
  { month: "Dec", score: 92 },
];

const SKILL_RATINGS = [
  { skill: "Communication", rating: 85 },
  { skill: "Problem Solving", rating: 90 },
  { skill: "Teamwork", rating: 88 },
  { skill: "Technical Knowledge", rating: 92 },
  { skill: "Leadership", rating: 75 },
  { skill: "Time Management", rating: 82 },
];

const GOALS_DATA = [
  {
    id: 1,
    title: "Complete Project X on time and within budget",
    dueDate: "May 30, 2025",
    progress: 75,
    status: "In Progress",
    priority: "High",
  },
  {
    id: 2,
    title: "Improve customer satisfaction score by 15%",
    dueDate: "Jun 30, 2025",
    progress: 60,
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Learn new technology stack for upcoming project",
    dueDate: "Jul 15, 2025",
    progress: 40,
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: 4,
    title: "Mentor junior team members",
    dueDate: "Dec 31, 2025",
    progress: 30,
    status: "In Progress",
    priority: "Low",
  },
];

const getBadgeColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "low":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-100";
  }
};

const Performance = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Performance Management
        </h1>
        <p className="text-slate-500 mt-1">
          Track your goals and professional development
        </p>
      </div>

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Goals</CardTitle>
              <CardDescription>
                Your current objectives and their progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {GOALS_DATA.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{goal.title}</h3>
                    <Badge className={getBadgeColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">
                    Due: {goal.dueDate}
                  </p>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">
                      {goal.progress}%
                    </span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overall Goal Progress</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={GOALS_DATA}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" tick={false} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, "Progress"]}
                    labelFormatter={(label) => {
                      const goal = GOALS_DATA.find((g) => g.title === label);
                      return goal ? goal.title : "";
                    }}
                  />
                  <Legend />
                  <Bar dataKey="progress" name="Progress" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Assessment</CardTitle>
              <CardDescription>Your current skill ratings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {SKILL_RATINGS.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.skill}</span>
                    <span>{skill.rating}/100</span>
                  </div>
                  <Progress value={skill.rating} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {SKILL_RATINGS.slice(0, 3).map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>{skill.skill}</span>
                      <Badge
                        variant="outline"
                        className="bg-hr-light text-hr-primary"
                      >
                        {skill.rating}/100
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Areas for Development</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {SKILL_RATINGS.slice(-3)
                    .reverse()
                    .map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span>{skill.skill}</span>
                        <Badge variant="outline" className="bg-slate-100">
                          {skill.rating}/100
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Score Trend</CardTitle>
              <CardDescription>
                Your performance scores over the past year
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={PERFORMANCE_DATA}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#0ea5e9"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}/100`, "Performance Score"]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="score"
                    name="Performance Score"
                    stroke="#0ea5e9"
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Latest Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="mb-4">
                    <p className="font-semibold">Q1 2025 Performance Review</p>
                    <p className="text-sm text-slate-500">
                      Conducted: April 10, 2025
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="font-medium text-slate-700">Overall Rating</p>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-slate-200 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-hr-primary h-2.5 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-slate-700">
                      Manager Comments
                    </p>
                    <p className="text-sm mt-1 italic text-slate-600">
                      "John has shown excellent progress in technical skills and
                      project completion. Communication with stakeholders has
                      improved. Should focus on developing leadership skills for
                      the next quarter."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="font-semibold">Q2 2025 Performance Review</p>
                  <p className="text-sm text-slate-500">
                    Scheduled: July 15, 2025
                  </p>

                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium">
                        Preparation Checklist:
                      </p>
                      <ul className="list-disc list-inside text-sm text-slate-600 mt-1 space-y-1">
                        <li>Update goal progress in system</li>
                        <li>Complete self-assessment form</li>
                        <li>Gather project accomplishments</li>
                        <li>Prepare questions for manager</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Performance;
