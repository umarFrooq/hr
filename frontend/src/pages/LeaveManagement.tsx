import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar as CalendarIcon, Check, Plus, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const LEAVE_DATA = [
  {
    id: 1,
    type: "Annual Leave",
    startDate: "2025-07-15",
    endDate: "2025-07-22",
    days: 5,
    status: "Approved",
  },
  {
    id: 2,
    type: "Sick Leave",
    startDate: "2025-05-10",
    endDate: "2025-05-10",
    days: 1,
    status: "Approved",
  },
  {
    id: 3,
    type: "Personal Day",
    startDate: "2025-05-23",
    endDate: "2025-05-23",
    days: 1,
    status: "Approved",
  },
  {
    id: 4,
    type: "Annual Leave",
    startDate: "2025-02-22",
    endDate: "2025-02-24",
    days: 3,
    status: "Approved",
  },
];

const LEAVE_BALANCE = [
  { type: "Annual Leave", total: 20, used: 5, remaining: 15 },
  { type: "Sick Leave", total: 10, used: 1, remaining: 9 },
  { type: "Personal Days", total: 3, used: 1, remaining: 2 },
];

const LeaveManagement = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMM yyyy");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Leave Management</h1>
        <p className="text-slate-500 mt-1">
          Manage your leave requests and balance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Leave Balance</CardTitle>
                <CardDescription>Your available leave days</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Request Leave
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Leave</DialogTitle>
                    <DialogDescription>
                      Submit a new leave request. Your manager will be notified.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="leaveType" className="text-right">
                        Leave Type
                      </Label>
                      <div className="col-span-3">
                        <Select>
                          <SelectTrigger id="leaveType">
                            <SelectValue placeholder="Select leave type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="annual">Annual Leave</SelectItem>
                            <SelectItem value="sick">Sick Leave</SelectItem>
                            <SelectItem value="personal">
                              Personal Day
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="startDate" className="text-right">
                        Start Date
                      </Label>
                      <div className="col-span-3">
                        <Input type="date" id="startDate" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="endDate" className="text-right">
                        End Date
                      </Label>
                      <div className="col-span-3">
                        <Input type="date" id="endDate" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any additional information"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setDialogOpen(false)}>
                      Submit Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {LEAVE_BALANCE.map((leave, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <div>
                        <span className="font-medium">{leave.type}</span>
                        <span className="text-sm text-slate-500 ml-2">
                          {leave.used} used of {leave.total} days
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {leave.remaining} days remaining
                      </span>
                    </div>
                    <Progress
                      value={(leave.used / leave.total) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Leave History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LEAVE_DATA.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.type}</TableCell>
                      <TableCell>
                        {formatDate(item.startDate)}{" "}
                        {item.startDate !== item.endDate &&
                          `to ${formatDate(item.endDate)}`}
                      </TableCell>
                      <TableCell>{item.days}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                        >
                          {item.status === "Approved" && (
                            <Check className="h-3 w-3 mr-1" />
                          )}
                          {item.status === "Rejected" && (
                            <X className="h-3 w-3 mr-1" />
                          )}
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                disabled={(date) => {
                  // Disable weekends
                  return date.getDay() === 0 || date.getDay() === 6;
                }}
              />
            </CardContent>
            <CardFooter>
              <div className="flex flex-col w-full space-y-1 text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2" />
                  <span>Approved Leave</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2" />
                  <span>Pending Approval</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-slate-300 mr-2" />
                  <span>Weekends/Holidays</span>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Company Holidays</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">New Year's Day</p>
                  <p className="text-sm text-slate-500">January 1, 2025</p>
                </div>
                <div>
                  <p className="font-medium">Memorial Day</p>
                  <p className="text-sm text-slate-500">May 26, 2025</p>
                </div>
                <div>
                  <p className="font-medium">Independence Day</p>
                  <p className="text-sm text-slate-500">July 4, 2025</p>
                </div>
                <div>
                  <p className="font-medium">Labor Day</p>
                  <p className="text-sm text-slate-500">September 1, 2025</p>
                </div>
                <div>
                  <p className="font-medium">Thanksgiving Day</p>
                  <p className="text-sm text-slate-500">November 27, 2025</p>
                </div>
                <div>
                  <p className="font-medium">Christmas Day</p>
                  <p className="text-sm text-slate-500">December 25, 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
