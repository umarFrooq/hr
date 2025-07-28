import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  format,
  addDays,
  isAfter,
  isBefore,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export const UpcomingInterviews = ({ interviews, onViewInterview }) => {
  // Get interviews in the next 7 days
  const upcomingInterviews = useMemo(() => {
    const today = new Date();
    const nextWeek = addDays(today, 7);

    return interviews
      .filter((interview) => {
        const interviewDate = new Date(interview.date);
        return (
          isAfter(interviewDate, today) &&
          isBefore(interviewDate, nextWeek) &&
          interview.status === "Scheduled"
        );
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [interviews]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Interviews</CardTitle>
        <CardDescription>Next 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingInterviews.length > 0 ? (
            upcomingInterviews.map((interview) => (
              <div
                key={interview.id}
                className="flex justify-between items-center p-3 bg-slate-50 rounded-md"
              >
                <div>
                  <p className="font-medium">{interview.candidate}</p>
                  <p className="text-xs text-slate-500">{interview.position}</p>
                  <p className="text-xs text-slate-500">
                    {format(new Date(interview.date), "MMM d")} •{" "}
                    {interview.startTime}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewInterview(interview)}
                >
                  Details
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-500">
              No upcoming interviews in the next 7 days
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const InterviewStatistics = ({ interviews }) => {
  const stats = useMemo(() => {
    const today = new Date();
    const firstDayOfMonth = startOfMonth(today);
    const lastDayOfMonth = endOfMonth(today);

    // Filter for current month
    const monthInterviews = interviews.filter((interview) => {
      const interviewDate = new Date(interview.date);
      return (
        !isBefore(interviewDate, firstDayOfMonth) &&
        !isAfter(interviewDate, lastDayOfMonth)
      );
    });

    const scheduled = monthInterviews.filter(
      (i) => i.status === "Scheduled",
    ).length;
    const completed = monthInterviews.filter(
      (i) => i.status === "Completed",
    ).length;
    const pendingFeedback = monthInterviews.filter(
      (i) => i.status === "Completed" && !i.notes,
    ).length;

    // Get unique positions being interviewed for
    const uniquePositions = new Set(monthInterviews.map((i) => i.position));

    return {
      scheduled,
      completed,
      pendingFeedback,
      positionsOpen: uniquePositions.size,
    };
  }, [interviews]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Statistics</CardTitle>
        <CardDescription>Current month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-md">
            <span className="text-3xl font-bold text-hr-primary">
              {stats.scheduled}
            </span>
            <span className="text-sm text-slate-500">Scheduled</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-md">
            <span className="text-3xl font-bold text-green-500">
              {stats.completed}
            </span>
            <span className="text-sm text-slate-500">Completed</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-md">
            <span className="text-3xl font-bold text-amber-500">
              {stats.pendingFeedback}
            </span>
            <span className="text-sm text-slate-500">Pending Feedback</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-md">
            <span className="text-3xl font-bold text-blue-500">
              {stats.positionsOpen}
            </span>
            <span className="text-sm text-slate-500">Positions Open</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
