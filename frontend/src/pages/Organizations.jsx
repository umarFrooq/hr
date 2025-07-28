import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  useGetAllOrganizationsQuery,
  useDeleteOrganizationMutation,
} from "@/store/api/organizationsApi";
import DataTableSearch from "@/components/DataTableSearch";
import { useNavigate } from "react-router-dom";
import { Plus, Building2, Edit, Trash2 } from "lucide-react";
import { roles, scope } from "@/utils/constant";
import { getParsedUserRoles } from "@/utils/helpers";
import { useSelector } from "react-redux";
import { hasPermission } from "@/utils/permission";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

function Organizations() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries(searchParams.entries());
  const { data, isLoading, isFetching, isError, error, refetch } = useGetAllOrganizationsQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );
  const user = useSelector((state) => state.auth.user);
  const permissions = useSelector((state) => state.auth.permissions);
  const [deleteOrganization, { isLoading: deleteLoading }] = useDeleteOrganizationMutation();

  const handleAddOrganization = () => {
    navigate("/organizations/add");
  };

  // Add placeholder handlers for edit and delete
  const handleEditOrganization = (orgId) => {
    navigate(`/organizations/edit/${orgId}`);
  };
  const handleDeleteOrganization = async (orgId) => {
    try {
      await deleteOrganization(orgId).unwrap();
      toast.success("Organization deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete organization. Please try again later.");
    }
  };

  let showSearchbar = true;
  let showAddButton = false;
  if (
    !isLoading &&
    hasPermission(permissions, "organizations", "create", [scope.ORGANIZATION, scope.TEAM])
  ) {
    showAddButton = true;
  }
  if (user?.role === roles.CLIENT) {
    showSearchbar = false;
    if (data?.results?.length && data?.results?.length >= 1) showAddButton = false;
  }

  return (
    <div className="">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-primary" />
            <span>Organizations</span>
          </h1>
          <p className="text-gray-600">Manage organizations and their details</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 w-full md:w-auto">
          {showSearchbar && (
            <DataTableSearch searchKey="city" placeholder="Search organizations..." />
          )}
          {showAddButton && (
            <Button
              onClick={handleAddOrganization}
              className="flex items-center space-x-2"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
              <span>Add Organization</span>
            </Button>
          )}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="text-center p-6">
              <p className="text-red-600 font-medium">Failed to fetch organizations.</p>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Type</TableHead>
                    {/* <TableHead>Leaves</TableHead> */}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading || isFetching ? (
                    <OrganizationTableSkeleton />
                  ) : (
                    data?.results?.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium min-w-[150px] max-w-[250px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                          {org.name ?? ""}
                        </TableCell>
                        <TableCell className="min-w-[150px] max-w-[250px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                          {org.address ?? "N/A"}
                        </TableCell>
                        <TableCell className="min-w-[100px] max-w-[150px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                          {org.city ?? "N/A"}
                        </TableCell>
                        <TableCell className="min-w-[100px] max-w-[150px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                          {org.country ?? "N/A"}
                        </TableCell>
                        <TableCell className="min-w-[80px] max-w-[120px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                          {org.orgType ?? "N/A"}
                        </TableCell>
                        {/* <TableCell className="min-w-[200px] max-w-[300px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                          {org.leaves ? (
                            <span>
                              Casual: {org.leaves.casual}, Sick: {org.leaves.sick}, Annual:{" "}
                              {org.leaves.annual}, Maternity: {org.leaves.maternity}, Paternity:{" "}
                              {org.leaves.paternity}, Other: {org.leaves.other}, Total:{" "}
                              {org.leaves.total}
                            </span>
                          ) : (
                            "N/A"
                          )}
                        </TableCell> */}
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {hasPermission(permissions, "organizations", "update", [
                              scope.ORGANIZATION,
                              scope.TEAM,
                            ]) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditOrganization(org.id)}
                                className="flex items-center space-x-1"
                                disabled={isFetching}
                              >
                                <Edit className="h-3 w-3" />
                                <span>Edit</span>
                              </Button>
                            )}
                            {hasPermission(permissions, "organizations", "delete", [
                              scope.ORGANIZATION,
                              scope.TEAM,
                            ]) && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    disabled={isFetching || deleteLoading}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    <span>Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure you want to delete this organization?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the
                                      organization "{org.name}" and remove all its data from the
                                      system.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteOrganization(org.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                      disabled={deleteLoading}
                                    >
                                      {deleteLoading ? "Deleting..." : "Yes, Delete Organization"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Organizations;

const OrganizationTableSkeleton = () => (
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
