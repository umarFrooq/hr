import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Calculator,
  Download,
  FileText,
  Calendar,
  Users,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PayrollReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Mock payroll data
  const payrollSummary = {
    totalPayroll: 485000,
    totalEmployees: 62,
    averageSalary: 7823,
    totalBenefits: 97000,
    totalTaxes: 121250,
    netPayroll: 363750,
  };

  const monthlyData = [
    { month: "Jan", gross: 475000, net: 355000, taxes: 120000 },
    { month: "Feb", gross: 478000, net: 358000, taxes: 120000 },
    { month: "Mar", gross: 482000, net: 361000, taxes: 121000 },
    { month: "Apr", gross: 485000, net: 363000, taxes: 122000 },
    { month: "May", gross: 485000, net: 363750, taxes: 121250 },
    { month: "Jun", gross: 485000, net: 363750, taxes: 121250 },
  ];

  const departmentPayroll = [
    {
      department: "Engineering",
      employees: 35,
      totalSalary: 175000,
      avgSalary: 5000,
    },
    { department: "Sales", employees: 12, totalSalary: 96000, avgSalary: 8000 },
    {
      department: "Marketing",
      employees: 8,
      totalSalary: 56000,
      avgSalary: 7000,
    },
    { department: "HR", employees: 4, totalSalary: 28000, avgSalary: 7000 },
    {
      department: "Finance",
      employees: 3,
      totalSalary: 24000,
      avgSalary: 8000,
    },
  ];

  const payrollDetails = [
    {
      id: "EMP001",
      name: "John Doe",
      department: "Engineering",
      grossSalary: 8500,
      deductions: 1275,
      netSalary: 7225,
      bonus: 0,
      overtime: 0,
    },
    {
      id: "EMP002",
      name: "Jane Smith",
      department: "Marketing",
      grossSalary: 7000,
      deductions: 1050,
      netSalary: 5950,
      bonus: 500,
      overtime: 0,
    },
    {
      id: "EMP003",
      name: "Mike Johnson",
      department: "Sales",
      grossSalary: 9000,
      deductions: 1350,
      netSalary: 7650,
      bonus: 1000,
      overtime: 200,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Payroll Reports</h1>
        <p className="text-slate-500 mt-1">
          Comprehensive payroll analytics and reporting
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Payroll
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  ${payrollSummary.totalPayroll.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">Current month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Average Salary
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  ${payrollSummary.averageSalary.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-1">Per employee</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Benefits
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  ${payrollSummary.totalBenefits.toLocaleString()}
                </p>
                <p className="text-xs text-purple-600 mt-1">20% of gross</p>
              </div>
              <Calculator className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Net Payroll
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  ${payrollSummary.netPayroll.toLocaleString()}
                </p>
                <p className="text-xs text-orange-600 mt-1">After deductions</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="current">Current Month</option>
            <option value="last">Last Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="sales">Sales</option>
            <option value="marketing">Marketing</option>
            <option value="hr">HR</option>
            <option value="finance">Finance</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Slips
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
          <TabsTrigger value="details">Employee Details</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Breakdown</CardTitle>
              <CardDescription>Current month payroll summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">
                    Gross Payroll
                  </p>
                  <p className="text-3xl font-bold">
                    ${payrollSummary.totalPayroll.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">
                    Total Deductions
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    ${payrollSummary.totalTaxes.toLocaleString()}
                  </p>
                  <div className="text-xs text-slate-500">
                    <p>Taxes: ${payrollSummary.totalTaxes.toLocaleString()}</p>
                    <p>
                      Benefits: ${payrollSummary.totalBenefits.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">
                    Net Payroll
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    ${payrollSummary.netPayroll.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Payroll Summary</CardTitle>
              <CardDescription>
                Payroll distribution across departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Total Salary</TableHead>
                    <TableHead>Average Salary</TableHead>
                    <TableHead>% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentPayroll.map((dept) => (
                    <TableRow key={dept.department}>
                      <TableCell className="font-medium">
                        {dept.department}
                      </TableCell>
                      <TableCell>{dept.employees}</TableCell>
                      <TableCell>
                        ${dept.totalSalary.toLocaleString()}
                      </TableCell>
                      <TableCell>${dept.avgSalary.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {(
                            (dept.totalSalary / payrollSummary.totalPayroll) *
                            100
                          ).toFixed(1)}
                          %
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Payroll Details</CardTitle>
              <CardDescription>
                Individual employee payroll breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Net Salary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollDetails.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.id}
                      </TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        ${employee.grossSalary.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-red-600">
                        -${employee.deductions.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-green-600">
                        +${employee.bonus.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-blue-600">
                        +${employee.overtime.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${employee.netSalary.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Trends</CardTitle>
              <CardDescription>
                Monthly payroll trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Bar dataKey="gross" fill="#8884d8" name="Gross Payroll" />
                  <Bar dataKey="net" fill="#82ca9d" name="Net Payroll" />
                  <Bar
                    dataKey="taxes"
                    fill="#ff7300"
                    name="Taxes & Deductions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollReports;
