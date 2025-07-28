import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetLeavesQuery,
  useUpdateLeaveStatusMutation,
  useDeleteLeaveMutation,
} from "@/store/api/leavesApi";
import { leaveStatus, roles, scope } from "@/utils/constant";
import { hasPermission } from "@/utils/permission";
import { useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { getDepartmentLabel } from "@/utils/helpers";
import { AlertTriangle, Calendar, Edit, Trash2 } from "lucide-react";
import AddLeave from "@/components/leaves/AddLeave";

const statusColor = {
  [leaveStatus.PENDING]: "default",
  [leaveStatus.APPROVED]: "secondary",
  [leaveStatus.REJECTED]: "destructive",
};

function LeaveManagement() {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetLeavesQuery();
  const permissions = useSelector((state) => state.auth.permissions);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [updateLeaveStatus, { isLoading: updateLoading }] = useUpdateLeaveStatusMutation();
  const [deleteLeave, { isLoading: deleteLoading }] = useDeleteLeaveMutation();
  const role = useSelector((state) => state.auth?.user?.role);

  const handleOpenDialog = (leave) => {
    if (leave) {
      setSelectedLeave(leave);
      setStatus(leave?.status ?? "");
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setStatus("");
      setReason("");
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const data = {};
      data.status = status;
      if (reason) data.reply = reason;
      await updateLeaveStatus({ id: selectedLeave.id, ...data }).unwrap();
      toast.success("Leave status updated!");
      setIsOpen(false);
      setStatus("");
      setReason("");
      setSelectedLeave(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLeave(id);
      toast.success("Leave has been deleted");
      refetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-primary" />
            <span>Leaves</span>
          </h1>
          {role === roles.EMPLOYEE ? null : (
            <p className="text-gray-600">Manage leave requests and update their status</p>
          )}
        </div>

        {!(role === roles.SUPER_ADMIN || role === roles.ADMIN || role == roles.CLIENT) && (
          <AddLeave />
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="text-center p-6">
              <p className="text-red-600 font-medium">Failed to fetch leaves.</p>
              <p className="text-gray-600 mb-4">
                {error?.data?.message || "An unexpected error occurred. Please try again."}
              </p>
              <Button onClick={refetch}>Retry</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Total Days</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    {hasPermission(permissions, "leaves", "update", [
                      scope.ORGANIZATION,
                      scope.TEAM,
                    ]) && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading || isFetching ? (
                    <LeaveTableSkeleton />
                  ) : (
                    data?.results?.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell className="min-w-[140px]">
                          {leave.user?.firstName} {leave.user?.lastName}
                        </TableCell>
                        <TableCell>{leave.user?.email}</TableCell>
                        <TableCell className="min-w-[175px]">
                          {getDepartmentLabel(leave.user?.department)}
                        </TableCell>
                        <TableCell className="min-w-[110px] capitalize">
                          {leave.leaveType}
                        </TableCell>
                        <TableCell className="min-w-[110px]">
                          {leave.startDate ? format(new Date(leave.startDate), "dd MMM yyyy") : ""}
                        </TableCell>
                        <TableCell className="min-w-[110px]">
                          {leave.endDate ? format(new Date(leave.endDate), "dd MMM yyyy") : ""}
                        </TableCell>
                        <TableCell className="text-center min-w-[100px]">
                          {leave.totalDays}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusColor[leave.status] || "secondary"}
                            className="capitalize"
                          >
                            {leave.status}
                          </Badge>
                        </TableCell>
                        {(hasPermission(permissions, "leaves", "update", [
                          scope.ORGANIZATION,
                          scope.TEAM,
                        ]) ||
                          hasPermission(permissions, "leaves", "delete", [
                            scope.ORGANIZATION,
                            scope.TEAM,
                          ])) && (
                          <TableCell className="flex items-center justify-end space-x-2">
                            {hasPermission(permissions, "leaves", "update", [
                              scope.ORGANIZATION,
                              scope.TEAM,
                            ]) &&
                              leave?.status === leaveStatus.PENDING && (
                                <Button
                                  size="sm"
                                  onClick={() => handleOpenDialog(leave)}
                                  disabled={isFetching}
                                  className="flex items-center space-x-1"
                                  variant="outline"
                                >
                                  <Edit className="h-3 w-3" />
                                  <span>Update</span>
                                </Button>
                              )}
                            {hasPermission(permissions, "leaves", "delete", [
                              scope.ORGANIZATION,
                              scope.TEAM,
                            ]) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(leave?.id)}
                                disabled={deleteLoading || updateLoading}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Delete</span>
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isOpen} onOpenChange={() => handleOpenDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <AlertDialogTitle>Update Leave Status</AlertDialogTitle>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reportsTo" className="text-sm font-medium text-gray-700">
                Reports To
              </Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setReason("");
                }}
                disabled={updateLoading}
              >
                <SelectTrigger className="h-11 border-gray-200 capitalize">
                  <SelectValue placeholder="Select Leave Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {Object.values(leaveStatus).map((value) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="hover:bg-gray-50 capitalize"
                      disabled={value === status || value === leaveStatus.PENDING}
                    >
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {status === leaveStatus.REJECTED && (
              <div className="space-y-2">
                <Label htmlFor="reportsTo" className="text-sm font-medium text-gray-700">
                  Reason
                </Label>
                <Textarea
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  placeholder={`Reason for ${status}`}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleOpenDialog()}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpdateStatus}
              disabled={updateLoading || (status === leaveStatus.REJECTED && !reason)}
            >
              {updateLoading ? "Updating..." : "Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default LeaveManagement;

const LeaveTableSkeleton = () => (
  <>
    {[...Array(10)].map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className="h-4 w-32" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-48" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-16" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-16" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-48" />
        </TableCell>
      </TableRow>
    ))}
  </>
);
