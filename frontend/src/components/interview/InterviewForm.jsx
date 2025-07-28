import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  createInterview,
  updateInterview,
  fetchPositions,
  fetchInterviewTypes,
  fetchInterviewers,
} from "@/services/interviewService";
import { MultiSelect } from "./MultiSelect";

const InterviewForm = ({
  isOpen,
  setIsOpen,
  selectedDate,
  initialData = null,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    candidate: "",
    position: "",
    type: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    interviewers: [],
    status: "Scheduled",
    notes: "",
  });

  const [positions, setPositions] = useState([]);
  const [interviewTypes, setInterviewTypes] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFormData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        date: format(selectedDate, "yyyy-MM-dd"),
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        candidate: initialData.candidate || "",
        position: initialData.position || "",
        type: initialData.type || "",
        date: initialData.date || "",
        startTime: initialData.startTime || "",
        endTime: initialData.endTime || "",
        location: initialData.location || "",
        interviewers: initialData.interviewers || [],
        status: initialData.status || "Scheduled",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const loadFormData = async () => {
    try {
      const [positionsData, typesData, interviewersData] = await Promise.all([
        fetchPositions(),
        fetchInterviewTypes(),
        fetchInterviewers(),
      ]);

      setPositions(positionsData);
      setInterviewTypes(typesData);
      setInterviewers(interviewersData);
    } catch (error) {
      console.error("Error loading form data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        await updateInterview(initialData.id, formData);
      } else {
        await createInterview(formData);
      }

      onSuccess?.();
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving interview:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      candidate: "",
      position: "",
      type: "",
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      startTime: "",
      endTime: "",
      location: "",
      interviewers: [],
      status: "Scheduled",
      notes: "",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-hr-primary" />
            {initialData ? "Edit Interview" : "Schedule New Interview"}
          </DialogTitle>
          <DialogDescription>
            {selectedDate
              ? `For ${format(selectedDate, "EEEE, MMMM d, yyyy")}`
              : "Fill in the details below"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="candidate">Candidate Name *</Label>
              <Input
                id="candidate"
                value={formData.candidate}
                onChange={(e) => handleInputChange("candidate", e.target.value)}
                placeholder="Enter candidate name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => handleInputChange("position", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Interview Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  {interviewTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g., Conference Room A, Zoom Meeting, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Interviewers *</Label>
            <MultiSelect
              options={interviewers.map((name) => ({
                label: name,
                value: name,
              }))}
              selected={formData.interviewers}
              onChange={(value) => handleInputChange("interviewers", value)}
              placeholder="Select interviewers"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="No Show">No Show</SelectItem>
                <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional information or requirements..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  {initialData ? "Updating..." : "Scheduling..."}
                </>
              ) : initialData ? (
                "Update Interview"
              ) : (
                "Schedule Interview"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewForm;
