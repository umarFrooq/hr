import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Interview,
  INTERVIEW_STATUSES,
  formatTimeForDatabase,
} from "@/data/interviewData";
import {
  createInterview,
  updateInterview,
  fetchPositions,
  fetchInterviewTypes,
  fetchInterviewers,
} from "@/services/interviewService";
import { MultiSelect } from "./MultiSelect";

const formSchema = z.object({
  candidate: z.string().min(1, "Candidate name is required"),
  position: z.string().min(1, "Position is required"),
  date: z.date({ required_error: "Date is required" }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  interviewers: z
    .array(z.string())
    .min(1, "At least one interviewer is required"),
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Interview type is required"),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
});

interface InterviewFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedDate: Date;
  initialData?: Interview | null;
  onSuccess?: () => void;
}

const InterviewForm: React.FC<InterviewFormProps> = ({
  isOpen,
  setIsOpen,
  selectedDate,
  initialData,
  onSuccess,
}) => {
  const [positions, setPositions] = useState<string[]>([]);
  const [interviewTypes, setInterviewTypes] = useState<string[]>([]);
  const [interviewers, setInterviewers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isEditing = !!initialData;

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidate: initialData?.candidate || "",
      position: initialData?.position || "",
      date: initialData ? new Date(initialData.date) : selectedDate,
      startTime: initialData?.startTime || "10:00",
      endTime: initialData?.endTime || "11:00",
      interviewers: initialData?.interviewers || [],
      location: initialData?.location || "",
      type: initialData?.type || "",
      status: initialData?.status || "Scheduled",
      notes: initialData?.notes || "",
    },
  });

  // Load reference data from the database
  useEffect(() => {
    const loadReferenceData = async () => {
      const fetchedPositions = await fetchPositions();
      const fetchedInterviewTypes = await fetchInterviewTypes();
      const fetchedInterviewers = await fetchInterviewers();

      setPositions(fetchedPositions);
      setInterviewTypes(fetchedInterviewTypes);
      setInterviewers(fetchedInterviewers);
    };

    loadReferenceData();
  }, []);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const interviewData: Interview = {
        id: initialData?.id || "",
        candidate: values.candidate,
        position: values.position,
        date: format(values.date, "yyyy-MM-dd"),
        startTime: values.startTime,
        endTime: values.endTime,
        start_time: formatTimeForDatabase(values.startTime),
        end_time: formatTimeForDatabase(values.endTime),
        interviewers: values.interviewers,
        location: values.location,
        type: values.type,
        status: values.status,
        notes: values.notes,
      };

      let result: Interview | null = null;

      if (isEditing && initialData?.id) {
        result = await updateInterview(initialData.id, interviewData);
      } else {
        result = await createInterview(interviewData);
      }

      if (result) {
        setIsOpen(false);
        if (onSuccess) onSuccess();
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting interview form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Interview" : "Schedule New Interview"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the interview details."
              : "Fill in the details to schedule a new interview."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Candidate Name */}
              <FormField
                control={form.control}
                name="candidate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate</FormLabel>
                    <FormControl>
                      <Input placeholder="Candidate name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Position */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {positions.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Interviewers */}
              <FormField
                control={form.control}
                name="interviewers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interviewers</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={interviewers.map((name) => ({
                          value: name,
                          label: name,
                        }))}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Select interviewers"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Meeting room or virtual link"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Interview Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select interview type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {interviewTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INTERVIEW_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes or preparation requirements"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Update Interview"
                    : "Schedule Interview"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewForm;
