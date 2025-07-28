import React, { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, Filter } from "lucide-react";
import InterviewCard from "./InterviewCard";
import { INTERVIEW_STATUSES } from "@/data/interviewData";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const InterviewList = ({
  interviews,
  selectedDate,
  onUpdateInterview,
  onAddClick,
}) => {
  const [statusFilter, setStatusFilter] = useState({});

  const isStatusFilterActive = Object.values(statusFilter).some(
    (value) => value,
  );

  // Apply filters
  let filteredInterviews = interviews.filter((interview) =>
    isSameDay(new Date(interview.date), selectedDate),
  );

  if (isStatusFilterActive) {
    filteredInterviews = filteredInterviews.filter(
      (interview) => !statusFilter[interview.status],
    );
  }

  const formatDateFull = (date) => {
    return format(date, "EEEE, MMMM d, yyyy");
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const clearFilters = () => {
    setStatusFilter({});
  };

  if (filteredInterviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CalendarIcon className="h-12 w-12 text-slate-300 mb-3" />
        <h3 className="text-lg font-medium text-slate-600">
          No interviews scheduled for this day
        </h3>
        <p className="text-slate-400 max-w-sm mx-auto mt-1">
          Select a different date or schedule a new interview using the button
          above
        </p>
        <Button className="mt-4" onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {filteredInterviews.length} interview
            {filteredInterviews.length !== 1 ? "s" : ""} scheduled
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Status{" "}
              {isStatusFilterActive && (
                <span className="ml-1 bg-primary h-1.5 w-1.5 rounded-full"></span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Filter by status</h4>
              <div className="border-t my-2"></div>
              <div className="space-y-2">
                {INTERVIEW_STATUSES.map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={statusFilter[status]}
                      onCheckedChange={() => handleStatusFilterChange(status)}
                    />
                    <Label
                      htmlFor={`status-${status}`}
                      className="text-sm font-normal"
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  disabled={!isStatusFilterActive}
                >
                  Reset
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {filteredInterviews.map((interview) => (
        <InterviewCard
          key={interview.id}
          interview={interview}
          onUpdate={onUpdateInterview}
        />
      ))}
    </div>
  );
};

export default InterviewList;
