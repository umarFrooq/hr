import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  User,
  Users,
  MapPin,
  Edit,
  Trash2,
  ArrowRight,
  Video,
} from "lucide-react";
import { deleteInterview } from "@/services/interviewService";
import InterviewForm from "./InterviewForm";

const InterviewCard = ({ interview, onUpdate }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to render location icon based on location type
  const renderLocationIcon = (location) => {
    if (
      location.toLowerCase().includes("zoom") ||
      location.toLowerCase().includes("meet")
    ) {
      return <Video className="h-4 w-4 text-blue-500" />;
    } else {
      return <MapPin className="h-4 w-4 text-red-500" />;
    }
  };

  // Function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "No Show":
        return "bg-gray-100 text-gray-800";
      case "Rescheduled":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deleteInterview(interview.id, interview.candidate);
    if (success) {
      onUpdate();
    }
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card key={interview.id} className="overflow-hidden">
        <div className="bg-slate-50 p-3 border-b flex justify-between items-center">
          <div className="flex items-center">
            <User className="h-5 w-5 text-hr-primary mr-2" />
            <h3 className="font-medium">
              {interview.candidate}
              <span className="text-sm font-normal text-slate-500 ml-2">
                ({interview.position})
              </span>
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-slate-400 mr-2" />
                <span className="text-sm">
                  {interview.startTime} - {interview.endTime}
                </span>
              </div>

              <div className="flex items-center">
                {renderLocationIcon(interview.location)}
                <span className="text-sm ml-2">{interview.location}</span>
              </div>

              <div className="flex items-center">
                <Users className="h-4 w-4 text-slate-400 mr-2" />
                <span className="text-sm">
                  {interview.interviewers.join(", ")}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium block text-slate-500">
                  Interview Type
                </span>
                <span className="text-sm">{interview.type}</span>
              </div>

              <div>
                <span className="text-xs font-medium block text-slate-500">
                  Status
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(interview.status)} mt-1`}
                >
                  {interview.status}
                </span>
              </div>

              {interview.notes && (
                <div>
                  <span className="text-xs font-medium block text-slate-500">
                    Notes
                  </span>
                  <span className="text-sm block mt-1 text-slate-600 line-clamp-2">
                    {interview.notes}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <div className="bg-slate-50 px-4 py-3 border-t text-right">
          <Button size="sm" onClick={() => setIsEditDialogOpen(true)}>
            View Details
            <ArrowRight className="ml-2 h-3 w-3" />
          </Button>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Interview</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the interview with{" "}
              {interview.candidate}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Interview Dialog */}
      <InterviewForm
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        selectedDate={new Date(interview.date)}
        initialData={interview}
        onSuccess={onUpdate}
      />
    </>
  );
};

export default InterviewCard;
