import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Clock, Calendar as CalendarIcon, LogIn, LogOut } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useGetAllUsersQuery } from "@/store/api/usersApi";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useAddAttendanceMutation } from "@/store/api/attendanceApi";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { getParsedUserRoles } from "@/utils/helpers";

const CheckInOutCard = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 750);
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery(
    debouncedSearch ? { name: "firstName", value: debouncedSearch } : {}
  );
  const [addAttendance, { isLoading: isAddingAttendance }] = useAddAttendanceMutation();

  // Local state for form fields
  const [selectedUser, setSelectedUser] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [checkType, setCheckType] = useState("in");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error("Please select a user.");
      return;
    }
    if (!date) {
      toast.error("Please select a date.");
      return;
    }
    if (!time) {
      toast.error("Please select a time.");
      return;
    }
    const [hours, minutes] = time.split(":").map(Number);
    const checkDateTime = new Date(date);
    checkDateTime.setHours(hours, minutes);
    const attendanceData = {
      user: selectedUser,
      [checkType === "in" ? "checkin" : "checkout"]: checkDateTime.toISOString(),
    };
    try {
      await addAttendance(attendanceData).unwrap();
      toast.success(`User checked ${checkType} successfully!`);
      // Optionally reset form
      setSelectedUser("");
      setDate(new Date());
      setTime(format(new Date(), "HH:mm"));
      setCheckType("in");
    } catch (error) {
      toast.error(`Failed to check ${checkType}.`);
    }
  };
  // In your CheckInOutCard component, add this useEffect to reset search when user is selected
  useEffect(() => {
    if (selectedUser) {
      setSearch(""); // Clear search when user is selected
    }
  }, [selectedUser]);

  // Also update the userOptions dependency
  const userOptions = useMemo(
    () =>
      usersData?.results?.map((user) => ({
        value: user.id || user._id,
        label: `${user.firstName} ${user.lastName} - ${user.employeeId} (${getParsedUserRoles(
          user?.role
        )})`,
      })) || [],
    [usersData?.results] // More specific dependency
  );

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Manual Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Employee</label>
            <SearchableSelect
              options={userOptions}
              value={selectedUser || ""}
              onSelect={setSelectedUser}
              onSearchChange={setSearch}
              placeholder="Select a user"
              searchPlaceholder="Search for a user..."
              notFoundText="No users found"
              isLoading={usersLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disableFutureDates
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Check Type</label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={checkType === "in" ? "default" : "outline"}
                onClick={() => setCheckType("in")}
                className="flex-1"
              >
                <LogIn className="mr-2 h-4 w-4" /> Check In
              </Button>
              <Button
                type="button"
                variant={checkType === "out" ? "default" : "outline"}
                onClick={() => setCheckType("out")}
                className="flex-1"
              >
                <LogOut className="mr-2 h-4 w-4" /> Check Out
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isAddingAttendance}>
            {isAddingAttendance ? "Submitting..." : "Submit Attendance"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckInOutCard;
