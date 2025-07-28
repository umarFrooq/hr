import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

const InterviewCalendar = ({ selectedDate, setSelectedDate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>
          Select a date to view or schedule interviews
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
};

export default InterviewCalendar;
