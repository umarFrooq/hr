import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { leavesType } from "@/utils/constant";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { useAddLeaveMutation } from "@/store/api/leavesApi";
import { toast } from "sonner";
import { add } from "date-fns";

const leaveTypeOptions = Object.values(leavesType);

const AddLeave = () => {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [addLeave, { isLoading }] = useAddLeaveMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !leaveType || !reason) return;

    const data = {
      startDate,
      endDate,
      leaveType,
      reason,
    };
    data.endDate = add(endDate, { hours: 23, minutes: 59 });

    try {
      await addLeave(data).unwrap(); // ensures error throws if API fails
      toast.success("Leave submitted successfully!");
      setOpen(false); // Only closes if request is successful
      setStartDate(null);
      setEndDate(null);
      setLeaveType("");
      setReason("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit leave.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Leave</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Leave Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Leave Type</label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <Textarea
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading || !startDate || !endDate || !leaveType || !reason}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeave;
