import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

import InterviewCalendar from "@/components/interview/InterviewCalendar";
import InterviewForm from "@/components/interview/InterviewForm";
import InterviewList from "@/components/interview/InterviewList";
import { UpcomingInterviews, InterviewStatistics } from "@/components/interview/InterviewStats";
import { fetchInterviews } from "@/services/interviewService";

const InterviewScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Load interviews from database
  const loadInterviews = async () => {
    setLoading(true);
    try {
      const data = await fetchInterviews();
      setInterviews(data);
    } catch (error) {
      toast({
        title: "Error loading interviews",
        description: error.message || "An error occurred while loading interviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleViewInterview = (interview) => {
    setSelectedInterview(interview);
    setSelectedDate(new Date(interview.date));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Interview Scheduler</h1>
        <p className="text-slate-500 mt-1">Manage and schedule interviews for candidates</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-hr-primary" />
          <span className="ml-2 text-lg">Loading interviews...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <InterviewCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{format(selectedDate, "EEEE, MMMM d, yyyy")}</CardTitle>
                  <CardDescription>
                    {
                      interviews.filter(
                        (i) =>
                          format(new Date(i.date), "yyyy-MM-dd") ===
                          format(selectedDate, "yyyy-MM-dd")
                      ).length
                    }{" "}
                    interview
                    {interviews.filter(
                      (i) =>
                        format(new Date(i.date), "yyyy-MM-dd") ===
                        format(selectedDate, "yyyy-MM-dd")
                    ).length !== 1
                      ? "s"
                      : ""}{" "}
                    scheduled
                  </CardDescription>
                </div>
                <div>
                  <InterviewForm
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                    selectedDate={selectedDate}
                    onSuccess={loadInterviews}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <InterviewList
                  interviews={interviews}
                  selectedDate={selectedDate}
                  onUpdateInterview={loadInterviews}
                  onAddClick={() => setIsDialogOpen(true)}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UpcomingInterviews interviews={interviews} onViewInterview={handleViewInterview} />
            <InterviewStatistics interviews={interviews} />
          </div>
        </>
      )}
    </div>
  );
};

export default InterviewScheduler;
