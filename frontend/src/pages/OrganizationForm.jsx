import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Building2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useGetOrganizationByIdQuery,
  useUploadOrganizationLogoMutation,
} from "@/store/api/organizationsApi";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetAllUsersQuery } from "@/store/api/usersApi";
import { useDispatch, useSelector } from "react-redux";
import { roles } from "@/utils/constant";
import { getResponseData, getUpdatedData } from "@/utils/helpers";
import { addUserOrganization } from "@/store/slices/authSlice";

const initialFormData = {
  name: "",
  address: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  logo: "",
  user: "",
  leaves: {
    casual: 0,
    sick: 0,
    annual: 0,
    maternity: 0,
    paternity: 0,
    other: 0,
    total: 0,
    expiryDate: "",
    carryForwardLeaves: false,
  },
};

const OrganizationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: orgData, isLoading: orgLoading } = useGetOrganizationByIdQuery(id, {
    skip: !id,
  });
  const [createOrganization, { isLoading: createLoading }] = useCreateOrganizationMutation();
  const [updateOrganization, { isLoading: updateLoading }] = useUpdateOrganizationMutation();
  const [formData, setFormData] = useState(initialFormData);
  const [initialData, setInitialData] = useState(initialFormData);
  const [adminSearch, setAdminSearch] = useState("");
  const debouncedAdminSearch = useDebounce(adminSearch, 400);
  const { data: adminUsersData, isLoading: isLoadingAdmins } = useGetAllUsersQuery({
    role: "admin",
    ...(debouncedAdminSearch && { name: "firstName", value: debouncedAdminSearch }),
    limit: 20,
  });
  const adminOptions = (adminUsersData?.results || []).map((user) => ({
    value: user.id,
    label: `${user.firstName ?? ""} ${user.lastName ?? ""} (${user.email})`,
  }));
  const currentUser = useSelector((state) => state.auth?.user);
  const isSuperAdmin = currentUser?.role === roles.SUPER_ADMIN;
  const [uploadOrganizationLogo] = useUploadOrganizationLogoMutation();
  const fileInputRef = useRef();

  useEffect(() => {
    if (id && orgData) {
      const org = orgData;
      const leavesData = {
        casual: org?.leaves?.casual || 0,
        sick: org?.leaves?.sick || 0,
        annual: org?.leaves?.annual || 0,
        maternity: org?.leaves?.maternity || 0,
        paternity: org?.leaves?.paternity || 0,
        other: org?.leaves?.other || 0,
        total: org?.leaves?.total || 0,
        expiryDate: org?.leaves?.expiryDate ? org?.leaves.expiryDate.slice(0, 10) : "",
        carryForwardLeaves: org?.leaves?.carryForwardLeaves || false,
      };
      setFormData({
        name: org?.name || "",
        address: org?.address || "",
        city: org?.city || "",
        state: org?.state || "",
        country: org?.country || "",
        zipCode: org?.zipCode || "",
        logo: org?.logo || "",
        leaves: leavesData,
        user: org?.user?.id || "",
      });
      setInitialData({
        name: org?.name || "",
        address: org?.address || "",
        city: org?.city || "",
        state: org?.state || "",
        country: org?.country || "",
        zipCode: org?.zipCode || "",
        logo: org?.logo || "",
        leaves: leavesData,
        user: org?.user?.id || "",
      });
    }
  }, [id, orgData]);

  const isSubmitting = createLoading || updateLoading;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLeavesChange = React.useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      leaves: { ...prev.leaves, [field]: value },
    }));
  }, []);

  useEffect(() => {
    const { casual, sick, annual, other } = formData.leaves;
    const totalLeaves =
      (Number(casual) || 0) + (Number(sick) || 0) + (Number(annual) || 0) + (Number(other) || 0);

    if (totalLeaves !== formData.leaves.total) {
      handleLeavesChange("total", totalLeaves);
    }
  }, [
    formData.leaves.casual,
    formData.leaves.sick,
    formData.leaves.annual,
    formData.leaves.other,
    formData.leaves.total,
    handleLeavesChange,
  ]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0] || null;
    setFormData((prev) => ({ ...prev, logo: file }));
  };

  const handleLogoAreaClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const _formData = formData;
      delete _formData.leaves.carryForwardLeaves;
      const updatedData = getUpdatedData(initialData, _formData);
      const { logo, ...data } = updatedData;
      let orgId = id;
      let responseData = null;
      if (id) {
        if (Object.keys(data).length) {
          const _data = await updateOrganization({ id, ...data }).unwrap();
          responseData = getResponseData(_data);
          toast.success("Organization updated successfully!");
        }
      } else {
        const _data = await createOrganization(data).unwrap();
        responseData = getResponseData(_data);
        orgId = responseData?.id || responseData?._id;
        toast.success("Organization created successfully!");
      }
      // Upload logo if selected
      if (logo && orgId) {
        const formDataObj = new FormData();
        formDataObj.append("logo", logo);
        const _data = await uploadOrganizationLogo({ id: orgId, formData: formDataObj }).unwrap();
        responseData = getResponseData(_data);
      }
      if (responseData?.id === currentUser?.organization?.id)
        dispatch(addUserOrganization(responseData));
      navigate("/organizations");
    } catch (error) {
      toast.error(error?.message || "Failed to save organization. Please try again.");
    }
  };

  if (orgLoading && id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
      </div>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl mx-auto8">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-800 flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <span>{id ? "Edit Organization" : "Add Organization"}</span>
          {isSubmitting && (
            <div className="ml-auto flex items-center space-x-2 text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>{id ? "Updating..." : "Creating..."}</span>
            </div>
          )}
        </CardTitle>
        <p className="text-gray-600 text-sm mt-2">
          {id
            ? "Update organization details and leave policies."
            : "Enter organization details and leave policies."}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-lg font-medium text-gray-900">Organization Information</h3>
              <p className="text-sm text-gray-500">Basic details about the organization</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Organization name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip/Postal Code *</Label>
                <Input
                  id="zipCode"
                  type="number"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-6">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-lg font-medium text-gray-900">Leave Policies</h3>
              <p className="text-sm text-gray-500">Set leave entitlements for this organization</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "casual", label: "Casual Leaves" },
                { key: "sick", label: "Sick Leaves" },
                { key: "annual", label: "Annual Leaves" },
                { key: "maternity", label: "Maternity Leaves" },
                { key: "paternity", label: "Paternity Leaves" },
                { key: "other", label: "Other Leaves" },
                { key: "total", label: "Total Leaves" },
              ].map(({ key, label }) => (
                <div className="space-y-2" key={key}>
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    type="number"
                    min={0}
                    value={formData.leaves[key]}
                    onChange={(e) => handleLeavesChange(key, Number(e.target.value))}
                    disabled={key === "total" || isSubmitting}
                  />
                </div>
              ))}
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Leave Expiry</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.leaves.expiryDate}
                  onChange={(e) => handleLeavesChange("expiryDate", e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="carryForwardLeaves"
                checked={formData.leaves.carryForwardLeaves}
                onCheckedChange={(checked) => handleLeavesChange("carryForwardLeaves", checked)}
                disabled={isSubmitting}
              />
              <Label
                htmlFor="carryForwardLeaves"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Carry Forward Leaves
              </Label>
            </div>
          </div>
          {isSuperAdmin && (
            <div className="space-y-4 mt-6">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="text-lg font-medium text-gray-900">Organization Admin</h3>
                <p className="text-sm text-gray-500">Assign an admin to this organization</p>
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="admin" className="block mb-1">
                  Admin *
                </Label>
                <SearchableSelect
                  options={adminOptions}
                  value={formData.user || ""}
                  onSelect={(val) => handleInputChange("user", val)}
                  onSearchChange={setAdminSearch}
                  placeholder="Select Admin"
                  searchPlaceholder="Search admins..."
                  notFoundText="No admin found."
                  isLoading={isLoadingAdmins}
                  className="w-full"
                />
              </div>
            </div>
          )}
          {/* Logo upload field */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="logo">Organization Logo</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg w-40 h-40 cursor-pointer mx-auto bg-gray-50 hover:bg-gray-100 transition"
              onClick={handleLogoAreaClick}
            >
              {formData.logo ? (
                <>
                  {formData.logo.type && formData.logo.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(formData.logo)}
                      alt="Logo preview"
                      className="object-cover w-40 h-40 mb-2 rounded"
                    />
                  ) : (
                    <img
                      src={formData.logo}
                      alt="Organization Logo"
                      className="object-cover w-40 h-40 mb-2 rounded"
                    />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <span className="text-gray-500 text-center text-sm">
                    Upload organization logo here
                  </span>
                </div>
              )}
              <Input
                id="logo"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                disabled={isSubmitting}
                className="hidden"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/organizations")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2" disabled={isSubmitting}>
              <Save className="h-4 w-4" />
              {id ? "Update Organization" : "Create Organization"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrganizationForm;
