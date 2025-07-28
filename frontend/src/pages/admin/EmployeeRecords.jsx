import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Plus, Search, Download, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import EmployeeForm from "./EmployeeForm";

// Static employee data
const staticEmployees = [
  {
    id: "EMP001",
    name: "John Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    position: "Senior Developer",
    join_date: "2023-01-15",
    status: "Active",
  },
  {
    id: "EMP002",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    join_date: "2023-03-20",
    status: "Active",
  },
  {
    id: "EMP003",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    department: "HR",
    position: "HR Specialist",
    join_date: "2022-11-10",
    status: "Active",
  },
  {
    id: "EMP004",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    department: "Finance",
    position: "Financial Analyst",
    join_date: "2023-05-01",
    status: "On Leave",
  },
  {
    id: "EMP005",
    name: "David Lee",
    email: "david.lee@company.com",
    department: "Operations",
    position: "Operations Manager",
    join_date: "2022-08-15",
    status: "Active",
  },
];

const EmployeeRecords = () => {
  const [employees, setEmployees] = useState(staticEmployees);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    setEmployees((prev) => prev.filter((emp) => emp.id !== id));

    toast({
      title: "Success",
      description: "Employee record deleted successfully",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: { color: "bg-green-100 text-green-800", text: "Active" },
      "On Leave": { color: "bg-yellow-100 text-yellow-800", text: "On Leave" },
      Inactive: { color: "bg-red-100 text-red-800", text: "Inactive" },
    };

    const config = statusConfig[status] || statusConfig["Active"];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" ||
      employee.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(employees.map((emp) => emp.department))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">Loading employee records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Employee Records</h1>
        <p className="text-slate-500 mt-1">
          Manage employee information and records
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Employees
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {employees.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-hr-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {employees.filter((e) => e.status === "Active").length}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">On Leave</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {employees.filter((e) => e.status === "On Leave").length}
                </p>
              </div>
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Departments
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {departments.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>
                View and manage all employee records
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setEditingEmployee(null);
                  setShowForm(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      {new Date(employee.join_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingEmployee(employee);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() =>
                            handleDelete(employee.id, employee.name)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No employees found</p>
              <p className="text-slate-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Form Modal */}
      <EmployeeForm
        open={showForm}
        onClose={(shouldRefresh) => {
          setShowForm(false);
          setEditingEmployee(null);
        }}
        employee={editingEmployee}
      />
    </div>
  );
};

export default EmployeeRecords;
