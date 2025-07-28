import React, { useState, useEffect } from "react";
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
import {
  ChevronDown,
  Download,
  FileText,
  Plus,
  Search,
  SlidersHorizontal,
  User,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import EmployeeForm from "./EmployeeForm";
import { useToast } from "@/components/ui/use-toast";

// Department options
const DEPARTMENTS = [
  "All",
  "Engineering",
  "Marketing",
  "HR",
  "Finance",
  "Operations",
  "Sales",
  "Customer Support",
];
const STATUS_OPTIONS = ["All", "Active", "On Leave", "Inactive"];

// Add available roles for selection (must match backend enum)
const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "hr_manager", label: "HR Manager" },
  { value: "team_lead", label: "Team Lead" },
  { value: "employee", label: "Employee" },
  { value: "accountant", label: "Accountant" },
];

export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  join_date: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  user_id: string | null; // FIX: Needed for role management
};

const EmployeeRecords = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [employeeRoles, setEmployeeRoles] = useState<Record<string, string[]>>(
    {},
  );

  const { toast } = useToast();

  const fetchEmployees = async () => {
    setLoading(true);
    // fetch employees
    const { data, error } = await supabase
      .from("employees")
      .select("*, user_id");
    // fetch roles
    const { data: userRoles } = await supabase
      .from("user_roles")
      .select("user_id, role");
    if (error) {
      toast({
        title: "Fetch error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Map user_id to string or null
      const mappedEmployees = (data || []).map((emp: any) => ({
        ...emp,
        user_id: emp.user_id != null ? String(emp.user_id) : null,
      }));
      setEmployees(mappedEmployees);
      // Map roles by employee id
      const empRoles: Record<string, string[]> = {};
      (mappedEmployees || []).forEach((emp) => {
        const roles = userRoles
          ? userRoles
              .filter(
                (r: any) =>
                  r.user_id &&
                  emp.user_id &&
                  String(r.user_id) === String(emp.user_id),
              )
              .map((r: any) => r.role)
          : [];
        empRoles[emp.id] = roles;
      });
      setEmployeeRoles(empRoles);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
    // Listen for real-time upserts/deletes
    const channel = supabase
      .channel("employees-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "employees" },
        fetchEmployees,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Add a function to update employee role
  const updateEmployeeRole = async (
    empId: string,
    userId: string | null,
    newRole: string,
  ) => {
    if (!userId) {
      toast({
        title: "Cannot update role",
        description: "No associated user for this employee.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      // Remove old roles first
      await supabase.from("user_roles").delete().eq("user_id", userId);

      // Fix: explicitly cast newRole to the allowed union
      const roleValue = [
        "admin",
        "hr_manager",
        "team_lead",
        "employee",
        "accountant",
      ].includes(newRole)
        ? (newRole as
            | "admin"
            | "hr_manager"
            | "team_lead"
            | "employee"
            | "accountant")
        : "employee";

      const { error } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role: roleValue }]);
      if (error) {
        toast({
          title: "Role update failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Role updated",
          description: `Role changed to ${roleValue}.`,
        });
        fetchEmployees();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filters
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" ||
      employee.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "All" || employee.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {status}
          </span>
        );
      case "On Leave":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {status}
          </span>
        );
      case "Inactive":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
            {status}
          </span>
        );
    }
  };

  // Actions
  const handleEdit = (emp: Employee) => {
    setEditEmployee(emp);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditEmployee(null);
    setFormOpen(true);
  };

  const handleDelete = async (emp: Employee) => {
    if (
      !window.confirm(
        `Are you sure you want to deactivate/delete employee ${emp.name}?`,
      )
    )
      return;
    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", emp.id);
    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Employee deleted",
        description: "Employee removed successfully!",
      });
      fetchEmployees();
    }
  };

  const handleFormClose = (updated?: boolean) => {
    setFormOpen(false);
    setEditEmployee(null);
    if (updated) fetchEmployees();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Employee Records</h1>
        <p className="text-slate-500 mt-1">
          Manage and view employee information
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search employees by name, email or ID..."
            className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Department: {selectedDepartment}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {DEPARTMENTS.map((department) => (
                <DropdownMenuItem
                  key={department}
                  onClick={() => setSelectedDepartment(department)}
                >
                  {department}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Status: {selectedStatus}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {STATUS_OPTIONS.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="flex items-center">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            More Filters
          </Button>

          <Button className="ml-auto flex items-center" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Employee Directory
            </CardTitle>
            <CardDescription>
              Showing {filteredEmployees.length} of {employees.length} employees
            </CardDescription>
          </div>
          <Button
            variant="outline"
            className="flex items-center"
            onClick={fetchEmployees}
          >
            <Download className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-slate-400"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-mono">{employee.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mr-2">
                          <User className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-xs text-slate-500">
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{formatDate(employee.join_date)}</TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <select
                          className="border rounded px-2 py-1 text-xs bg-white"
                          value={
                            (employeeRoles[employee.id] &&
                              employeeRoles[employee.id][0]) ||
                            "employee"
                          }
                          onChange={(e) =>
                            updateEmployeeRole(
                              employee.id,
                              employee.user_id, // FIX: Pass newly added user_id
                              e.target.value,
                            )
                          }
                          disabled={loading}
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                        {employeeRoles[employee.id] &&
                          employeeRoles[employee.id].length > 1 && (
                            <span className="text-xs ml-1 text-slate-400">
                              (multi-role)
                            </span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                            <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(employee)}
                          >
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(employee)}
                            className="text-red-500"
                          >
                            Deactivate/Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-slate-500"
                  >
                    No employees found matching your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-slate-500">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-slate-100">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Add/Edit Employee Modal */}
      {formOpen && (
        <EmployeeForm
          open={formOpen}
          onClose={handleFormClose}
          employee={editEmployee}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" /> Add New Employee
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" /> Generate Employee Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" /> Export Directory
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Engineering",
                "Marketing",
                "HR",
                "Finance",
                "Operations",
                "Sales",
                "Customer Support",
              ].map((dept, index) => {
                const count = employees.filter(
                  (emp) => emp.department === dept,
                ).length;
                const percentage = Math.round((count / employees.length) * 100);

                return (
                  <div key={dept}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{dept}</span>
                      <span>
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-hr-primary rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="border-l-2 border-green-500 pl-3 py-1">
                <p className="font-medium">New Employee Added</p>
                <p className="text-xs text-slate-500">Today, 10:30 AM</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-3 py-1">
                <p className="font-medium">Employee Status Updated</p>
                <p className="text-xs text-slate-500">Yesterday, 3:45 PM</p>
              </div>
              <div className="border-l-2 border-amber-500 pl-3 py-1">
                <p className="font-medium">Department Transfer Processed</p>
                <p className="text-xs text-slate-500">May 19, 2025</p>
              </div>
              <div className="border-l-2 border-purple-500 pl-3 py-1">
                <p className="font-medium">Bulk Employee Import</p>
                <p className="text-xs text-slate-500">May 18, 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeRecords;
