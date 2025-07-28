import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserCheck, Save, X, Upload } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useCreateUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUploadUserDocumentMutation,
  useDeleteUserDocumentMutation,
} from "@/store/api/usersApi";
import { roles } from "@/utils/constant";
import { getErrorMessage, getParsedUserRoles, getUpdatedData } from "@/utils/helpers";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { format } from "date-fns";
import { useGetAllOrganizationsQuery } from "@/store/api/organizationsApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DEPARTMENTS } from "@/utils/constant";

const initialFormDataSate = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  organization: "",
  employeeId: "",
  department: "",
  jobTitle: "",
  bio: "",
  dateOfBirth: "",
  role: "",
  reportsTo: "",
  startDate: "",
  password: "",
};

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUserOrganization = useSelector((state) => state.auth?.user?.organization);
  const currentUserRole = useSelector((state) => state.auth?.user?.role);
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useGetUserByIdQuery(id, {
    skip: !id, // prevents query when adding new user
  });
  const { data: allUsers, isFetching: usersLoading } = useGetAllUsersQuery({
    limit: 100,
    role: roles.MANAGER,
  });
  const { data: organizations, isLoading: organizationsLoading } = useGetAllOrganizationsQuery({
    limit: 1000,
  });
  const [createUser, { isLoading: createLoading }] = useCreateUserMutation();
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();
  const [documents, setDocuments] = useState(user?.documents || []);
  const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docFile, setDocFile] = useState(null);
  const [uploadUserDocument, { isLoading: isUploading }] = useUploadUserDocumentMutation();
  const [deleteUserDocument, { isLoading: isDeleting }] = useDeleteUserDocumentMutation();

  const isSubmitting = createLoading || updateLoading;

  const [initialFormData, setInitialFormData] = useState(initialFormDataSate);
  const [formData, setFormData] = useState(initialFormDataSate);

  const normalizeFileName = (name) => {
    return name.toLowerCase().trim();
  };

  useEffect(() => {
    if (isError) {
      toast.error(error.message || "Failed to fetch user. Please try again.");
    }
  }, [isError, error]);

  useEffect(() => {
    if (user) {
      const _userData = {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        organization: user?.organization?.id || "",
        employeeId: user?.employeeId || "",
        department: user?.department || "",
        jobTitle: user?.jobTitle || "",
        bio: user?.bio || "",
        dateOfBirth: user?.dateOfBirth ? format(user?.dateOfBirth, "yyyy-MM-dd") : "",
        role: user?.role || "",
        reportsTo: user?.reportsTo?.id || "",
        startDate: user?.startDate ? format(user?.startDate, "yyyy-MM-dd") : "",
        password: "",
      };
      setInitialFormData(_userData);
      setFormData(_userData);
      setDocuments(user?.documents || []);
    }
  }, [user]);

  const getAvailableRoles = () => {
    const allRoles = [roles.ADMIN, roles.HR, roles.MANAGER, roles.EMPLOYEE, roles.CLIENT];
    switch (currentUserRole) {
      case roles.SUPER_ADMIN:
        return allRoles;
      case roles.ADMIN:
        return allRoles.filter((r) => r !== roles.ADMIN);
      case roles.HR:
        return allRoles.filter((r) => r !== roles.ADMIN && r !== roles.HR);
      case roles.MANAGER:
        return allRoles.filter((r) => r !== roles.ADMIN && r !== roles.HR && r !== roles.MANAGER);
      case roles.CLIENT:
        return allRoles.filter((r) => r === roles.EMPLOYEE);
      default:
        return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = getUpdatedData(initialFormData, formData);
    try {
      if (id) {
        await updateUser({ id, ...updatedData }).unwrap();
        toast.success("User updated successfully!");
        navigate("/users");
      } else {
        if (currentUserRole === roles.CLIENT && currentUserOrganization?.id)
          updatedData.organization = currentUserOrganization?.id;

        await createUser(updatedData).unwrap();
        toast.success("User created successfully!");
        navigate("/users");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update user. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const supervisorOptions = (allUsers?.results ?? [])?.filter((user) => user.id !== id);

  const canManageDocs =
    [roles.SUPER_ADMIN, roles.ADMIN, roles.HR, roles.MANAGER].includes(currentUserRole) && !!id;

  const handleOpenDocDialog = () => {
    setDocName("");
    setDocFile(null);
    setIsDocDialogOpen(true);
  };

  // Update the handleUploadDocument function
  const handleUploadDocument = async () => {
    if (!docName || !docFile) return;

    // Check for duplicate document names (case-insensitive)
    const normalizedNewName = normalizeFileName(docName);
    const isDuplicate = documents.some((doc) => normalizeFileName(doc.name) === normalizedNewName);

    if (isDuplicate) {
      toast.error("A document with this name already exists. Please choose a different name.");
      return;
    }

    const formData = new FormData();
    formData.append(`customNames[0]`, docName);
    formData.append("files", docFile);

    try {
      const data = await uploadUserDocument({ id, formData }).unwrap();
      toast.success("Document uploaded successfully");
      setIsDocDialogOpen(false);
      setDocName("");
      setDocFile(null);
      setDocuments(() => data?.documents ?? []);
    } catch (err) {
      toast.error("Failed to upload document.");
    }
  };

  // Update the document name input to show real-time validation
  const checkDuplicateName = (name) => {
    if (!name.trim()) return false;
    const normalizedName = normalizeFileName(name);
    return documents.some((doc) => normalizeFileName(doc.name) === normalizedName);
  };

  const isDuplicateName = checkDuplicateName(docName);

  const handleDeleteDocument = async (docUrl, index) => {
    const formData = new FormData();
    formData.append(`removeFiles[${index}]`, docUrl);
    try {
      const data = await deleteUserDocument({ id, formData }).unwrap();
      toast.success("Document deleted successfully!");
      setDocuments(() => data?.documents ?? []);
    } catch (err) {
      toast.error("Failed to delete document.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-800 flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <UserCheck className="h-5 w-5 text-green-600" />
          </div>
          <span>User Details</span>
          {isSubmitting && (
            <div className="ml-auto flex items-center space-x-2 text-sm text-green-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              <span>Updating user...</span>
            </div>
          )}
        </CardTitle>
        <p className="text-gray-600 text-sm mt-2">
          Update user information, role assignments, and other details as needed.
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              <p className="text-sm text-gray-500">Basic user details and contact information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="h-11 border-gray-200 focus:border-blue-500"
                  disabled={isSubmitting}
                  required
                />
                {/* {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )} */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="h-11 border-gray-200 focus:border-blue-500"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-11 border-gray-200 focus:border-blue-500"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="h-11 border-gray-200 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="h-11 border-gray-200 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-sm font-medium text-gray-700">
                  Employee ID
                </Label>
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="Enter employee ID"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange("employeeId", e.target.value)}
                  className="h-11 border-gray-200 focus:border-blue-500"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <input
                id="password"
                placeholder="Enter a password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="flex w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                Bio
              </Label>
              <textarea
                id="bio"
                rows={3}
                placeholder="Enter a brief bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="flex w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Organization Information Section */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-lg font-medium text-gray-900">Organization Information</h3>
              <p className="text-sm text-gray-500">Company and department details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUserRole === roles?.SUPER_ADMIN ||
                (currentUserRole === roles?.ADMIN && (
                  <div className="space-y-2">
                    <Label htmlFor="organization" className="text-sm font-medium text-gray-700">
                      Organization
                    </Label>
                    <Select
                      value={formData.organization}
                      onValueChange={(value) => handleInputChange("organization", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-11 border-gray-200">
                        <SelectValue placeholder="Select Organization" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        {organizations?.results?.map((organization) => (
                          <SelectItem
                            key={organization?.id}
                            value={organization?.id}
                            className="hover:bg-gray-50"
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{organization?.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}

              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                  Department
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange("department", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="h-11 border-gray-200">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value} className="hover:bg-gray-50">
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
                  Job Title
                </Label>
                <Input
                  id="jobTitle"
                  type="text"
                  placeholder="Enter job title"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  className="h-11 border-gray-200 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="h-11 border-gray-200 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Role & Permissions Section */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-lg font-medium text-gray-900">Role & Permissions</h3>
              <p className="text-sm text-gray-500">Define user role and reporting structure</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  User Role *
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => {
                    handleInputChange("role", value);
                    if (value === roles.ADMIN) handleInputChange("reportsTo", "");
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="h-11 border-gray-200">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {getAvailableRoles().map((role) => (
                      <SelectItem key={role} value={role} className="hover:bg-gray-50">
                        {getParsedUserRoles(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportsTo" className="text-sm font-medium text-gray-700">
                  Reports To
                </Label>
                <Select
                  value={formData.reportsTo}
                  onValueChange={(value) => handleInputChange("reportsTo", value)}
                  disabled={isSubmitting || formData.role === roles.ADMIN}
                >
                  <SelectTrigger className="h-11 border-gray-200">
                    <SelectValue placeholder="Select supervisor" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {supervisorOptions.map((user) => (
                      <SelectItem key={user.id} value={user.id} className="hover:bg-gray-50">
                        <div className="flex items-center justify-between gap-2 w-full">
                          <span>
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            ({getParsedUserRoles(user.role)})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Optional: Select who this user reports to</p>
              </div>
            </div>
          </div>

          {/* Document Management Section */}
          {canManageDocs && (
            <div className="space-y-4 mt-6">
              <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">User Documents</h3>
                <Button
                  type="button"
                  onClick={handleOpenDocDialog}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <Upload className="h-4 w-4" /> Add Document
                </Button>
              </div>
              <div className="flex flex-wrap gap-4">
                {documents && documents.length > 0 ? (
                  documents.map((doc, idx) => (
                    <div
                      key={doc.url || idx}
                      className="relative border rounded p-3 bg-gray-50 min-w-[180px] max-w-xs flex flex-col items-center"
                    >
                      <button
                        type="button"
                        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteDocument(doc.url, idx)}
                        disabled={isDeleting}
                        aria-label="Delete document"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="truncate w-full text-center font-medium mb-2">{doc.name}</div>
                      <a
                        href={doc.url}
                        target="_blank"
                        download={doc.name || "document"}
                        className="text-blue-600 hover:text-blue-700 underline text-xs break-all"
                      >
                        Download
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">No documents uploaded.</div>
                )}
              </div>
              {/* Upload Document Dialog */}
              <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="docName">Document Name</Label>
                      <Input
                        id="docName"
                        type="text"
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        placeholder="Enter document name"
                        className={isDuplicateName ? "border-red-500 focus:border-red-500" : ""}
                        required
                      />
                      {isDuplicateName && (
                        <p className="text-red-500 text-xs mt-1">
                          A document with this name already exists. Please choose a different name.
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="docFile">Select File</Label>
                      <Input
                        id="docFile"
                        type="file"
                        onChange={(e) => setDocFile(e.target.files[0])}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDocDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleUploadDocument}
                      disabled={isUploading || !docName || !docFile || isDuplicateName}
                    >
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link to="/users">
              <Button variant="outline" type="button" className="w-32" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 w-32 flex items-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{id ? "Updating..." : "Adding..."}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{id ? "Update User" : "Add User"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
