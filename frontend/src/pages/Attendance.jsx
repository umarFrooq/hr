import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Terminal } from "lucide-react";
import { useGetAttendancesQuery } from "@/store/api/attendanceApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { roles, scope } from "@/utils/constant";
import CheckInOutCard from "@/components/attendance/CheckInOutCard";
import { hasPermission } from "@/utils/permission";

const Attendance = () => {
  const userRole = useSelector((state) => state.auth?.user?.role);
  const permissions = useSelector((state) => state.auth?.permissions);
  const { data, isLoading, isError } = useGetAttendancesQuery(
    { sortBy: "-createAt" },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Attendance</h1>
        <p className="text-slate-500 mt-1">Track your work hours and attendance</p>
      </div>

      {/* Check In/Out Card and Calendar Card are hidden for client and employee */}
      {hasPermission(permissions, "checkin", "create", [scope.ORGANIZATION, scope.TEAM]) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <>
            <CheckInOutCard />
            {/* Calendar Card */}
            <Card>
              <CardHeader>
                <CardTitle>Calender</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center">
                  <Calendar
                    mode="single"
                    selected={new Date()}
                    className="rounded-md border"
                    showOutsideDays
                    disableFutureDates
                  />
                </div>
              </CardContent>
            </Card>
          </>
        </div>
      )}

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Employee</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Check In</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Check Out</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Work Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Organization</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="py-3 px-4">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton className="h-4 w-28" />
                      </td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-center">
                      <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>Failed to load attendance records.</AlertDescription>
                      </Alert>
                    </td>
                  </tr>
                ) : data?.results && data?.results?.length > 0 ? (
                  data?.results?.map((record) => (
                    <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{record.name}</div>
                        <div className="text-sm text-slate-500">{record.employeeId}</div>
                      </td>
                      <td className="py-3 px-4">{format(new Date(record.checkin), "P")}</td>
                      <td className="py-3 px-4">{format(new Date(record.checkin), "h:mm a")}</td>
                      <td className="py-3 px-4">
                        {record.checkout ? format(new Date(record.checkout), "h:mm a") : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="capitalize">
                          {record.workStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{record.organizationName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-500">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
