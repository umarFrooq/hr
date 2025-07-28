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
import { Progress } from "@/components/ui/progress";
import { BarChart, TrendingUp, Target, Award } from "lucide-react";

const Performance = () => {
  const performanceMetrics = {
    overallScore: 85,
    goals: [
      {
        id: 1,
        title: "Complete Project Alpha",
        progress: 90,
        status: "On Track",
      },
      {
        id: 2,
        title: "Improve Team Collaboration",
        progress: 75,
        status: "In Progress",
      },
      { id: 3, title: "Learn New Technology", progress: 60, status: "Behind" },
    ],
    reviews: [
      {
        id: 1,
        period: "Q1 2025",
        score: 4.2,
        reviewer: "Sarah Johnson",
        date: "2025-03-31",
      },
      {
        id: 2,
        period: "Q4 2024",
        score: 4.0,
        reviewer: "Mike Chen",
        date: "2024-12-31",
      },
      {
        id: 3,
        period: "Q3 2024",
        score: 3.8,
        reviewer: "Sarah Johnson",
        date: "2024-09-30",
      },
    ],
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Performance Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Track your goals and performance reviews
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <BarChart className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceMetrics.overallScore}%
            </div>
            <p className="text-xs text-slate-500">Above average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceMetrics.goals.length}
            </div>
            <p className="text-xs text-slate-500">Current quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Review</CardTitle>
            <Award className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-slate-500">Out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Goals</CardTitle>
          <CardDescription>
            Your performance goals for this quarter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {performanceMetrics.goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-slate-800">{goal.title}</h4>
                  <Badge
                    variant={
                      goal.status === "On Track"
                        ? "default"
                        : goal.status === "In Progress"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {goal.status}
                  </Badge>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <p className="text-sm text-slate-500">
                  {goal.progress}% complete
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Reviews</CardTitle>
          <CardDescription>
            Your recent performance review history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceMetrics.reviews.map((review) => (
              <div
                key={review.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-800">{review.period}</p>
                  <p className="text-sm text-slate-500">
                    Reviewed by {review.reviewer}
                  </p>
                  <p className="text-xs text-slate-400">{review.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {review.score}
                  </div>
                  <p className="text-xs text-slate-500">/ 5.0</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Performance;
