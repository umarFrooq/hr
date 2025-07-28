import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Filter,
  Calendar,
  Users,
  BarChart,
  PieChart,
  ArrowUpDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const PayrollReports = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Payroll Reports</h1>
        <p className="text-slate-500 mt-1">
          Generate and analyze payroll data across the organization
        </p>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="grid grid-cols-4 mb-8 w-full max-w-3xl">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 text-hr-primary mr-2" />
                Payroll Overview
              </CardTitle>
              <CardDescription>
                Current payroll period: May 1-31, 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase">
                    Total Personnel
                  </p>
                  <p className="text-3xl font-bold text-slate-800">142</p>
                  <p className="text-xs text-green-500 mt-2">
                    +3 from last month
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase">
                    Gross Payroll
                  </p>
                  <p className="text-3xl font-bold text-slate-800">$842,150</p>
                  <p className="text-xs text-green-500 mt-2">
                    +2.4% from last month
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase">Avg Salary</p>
                  <p className="text-3xl font-bold text-slate-800">$5,930</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Per employee/month
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-medium">Department Breakdown</p>
                  <Button variant="ghost" size="sm">
                    <PieChart className="h-4 w-4 mr-2" />
                    View Full Analysis
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-1/4 text-sm">Engineering</div>
                    <div className="w-1/2">
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: "40%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/4 text-right text-sm">
                      $336,860 (40%)
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/4 text-sm">Sales</div>
                    <div className="w-1/2">
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/4 text-right text-sm">
                      $210,538 (25%)
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/4 text-sm">Marketing</div>
                    <div className="w-1/2">
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-purple-500 rounded-full"
                          style={{ width: "15%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/4 text-right text-sm">
                      $126,323 (15%)
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/4 text-sm">Other</div>
                    <div className="w-1/2">
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-amber-500 rounded-full"
                          style={{ width: "20%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/4 text-right text-sm">
                      $168,430 (20%)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pending Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="flex justify-between items-center py-3 px-6">
                    <div>
                      <p className="font-medium">May Payroll Processing</p>
                      <p className="text-sm text-slate-500">Due by May 28th</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Process
                    </Button>
                  </div>
                  <div className="flex justify-between items-center py-3 px-6">
                    <div>
                      <p className="font-medium">3 Salary Adjustments</p>
                      <p className="text-sm text-slate-500">Pending approval</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                  <div className="flex justify-between items-center py-3 px-6">
                    <div>
                      <p className="font-medium">Tax Filing Preparation</p>
                      <p className="text-sm text-slate-500">Quarterly report</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Prepare
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y text-sm">
                  <div className="py-3 px-6">
                    <p className="font-medium">
                      Payroll processed for April 2025
                    </p>
                    <p className="text-slate-500">Apr 29, 2025 • By Admin</p>
                  </div>
                  <div className="py-3 px-6">
                    <p className="font-medium">New tax rates applied</p>
                    <p className="text-slate-500">Apr 15, 2025 • By System</p>
                  </div>
                  <div className="py-3 px-6">
                    <p className="font-medium">5 salary adjustments approved</p>
                    <p className="text-slate-500">
                      Apr 10, 2025 • By Finance Director
                    </p>
                  </div>
                  <div className="py-3 px-6">
                    <p className="font-medium">Benefits calculation updated</p>
                    <p className="text-slate-500">
                      Apr 5, 2025 • By HR Manager
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription>
                Create custom payroll reports for analysis and compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Report Type
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Payroll Summary</SelectItem>
                      <SelectItem value="detailed">Detailed Payroll</SelectItem>
                      <SelectItem value="tax">Tax Withholding</SelectItem>
                      <SelectItem value="department">
                        Department Analysis
                      </SelectItem>
                      <SelectItem value="benefits">Benefits Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Pay Period
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="may-2025">May 2025</SelectItem>
                      <SelectItem value="apr-2025">Apr 2025</SelectItem>
                      <SelectItem value="mar-2025">Mar 2025</SelectItem>
                      <SelectItem value="feb-2025">Feb 2025</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Format
                  </label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV File</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Additional Filters
                </Button>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="flex justify-between items-center py-4 px-6">
                  <div>
                    <p className="font-medium">
                      Monthly Payroll Summary - April 2025
                    </p>
                    <p className="text-xs text-slate-500">
                      Generated on Apr 30, 2025
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-4 px-6">
                  <div>
                    <p className="font-medium">Q1 Tax Withholding Report</p>
                    <p className="text-xs text-slate-500">
                      Generated on Apr 15, 2025
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-4 px-6">
                  <div>
                    <p className="font-medium">
                      Department Cost Analysis - Q1 2025
                    </p>
                    <p className="text-xs text-slate-500">
                      Generated on Apr 2, 2025
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-4 px-6">
                  <div>
                    <p className="font-medium">
                      Annual Benefits Summary - 2024
                    </p>
                    <p className="text-xs text-slate-500">
                      Generated on Jan 15, 2025
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Salary Trend Analysis</CardTitle>
                <CardDescription>
                  Average monthly salary by department over the past year
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <p className="text-slate-500">
                  Chart visualization would appear here
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payroll Distribution</CardTitle>
                <CardDescription>By department</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <p className="text-slate-500">Pie chart would appear here</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Compensation Analysis</CardTitle>
                  <CardDescription>
                    Compare salary ranges across departments and roles
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="text-left p-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <div className="flex items-center cursor-pointer">
                          Department
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <div className="flex items-center cursor-pointer">
                          Position
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <div className="flex items-center cursor-pointer">
                          Min Salary
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <div className="flex items-center cursor-pointer">
                          Max Salary
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <div className="flex items-center cursor-pointer">
                          Average
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Engineering</td>
                      <td className="p-3">Senior Engineer</td>
                      <td className="p-3">$95,000</td>
                      <td className="p-3">$145,000</td>
                      <td className="p-3">$122,500</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Engineering</td>
                      <td className="p-3">Software Engineer</td>
                      <td className="p-3">$75,000</td>
                      <td className="p-3">$110,000</td>
                      <td className="p-3">$92,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Marketing</td>
                      <td className="p-3">Marketing Manager</td>
                      <td className="p-3">$65,000</td>
                      <td className="p-3">$95,000</td>
                      <td className="p-3">$82,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Sales</td>
                      <td className="p-3">Account Executive</td>
                      <td className="p-3">$60,000</td>
                      <td className="p-3">$120,000</td>
                      <td className="p-3">$85,000</td>
                    </tr>
                    <tr>
                      <td className="p-3">HR</td>
                      <td className="p-3">HR Specialist</td>
                      <td className="p-3">$55,000</td>
                      <td className="p-3">$90,000</td>
                      <td className="p-3">$72,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Export payroll data for external use or backup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Range</label>
                  <div className="flex space-x-2">
                    <div className="w-1/2">
                      <Input type="date" />
                    </div>
                    <span className="flex items-center">to</span>
                    <div className="w-1/2">
                      <Input type="date" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Export Format</label>
                  <Select defaultValue="excel">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">
                        Excel Workbook (.xlsx)
                      </SelectItem>
                      <SelectItem value="csv">CSV File (.csv)</SelectItem>
                      <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Payroll Data
                </Button>
              </div>

              <div className="text-xs text-slate-500 pt-2">
                Note: Exports contain sensitive employee information. Please
                ensure data is handled according to company security policies.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduled Exports</CardTitle>
              <CardDescription>
                Configure automatic data exports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                  <div>
                    <p className="font-medium">Monthly Payroll Backup</p>
                    <p className="text-xs text-slate-500">
                      Runs on the 1st of every month • Excel format
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                  <div>
                    <p className="font-medium">Quarterly Tax Report</p>
                    <p className="text-xs text-slate-500">
                      Runs on the 15th of Jan, Apr, Jul, Oct • PDF format
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>

                <Button variant="outline" className="w-full mt-2">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule New Export
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="flex justify-between items-center py-3 px-6">
                  <div>
                    <p className="font-medium">
                      Monthly Payroll Backup - May 2025
                    </p>
                    <p className="text-xs text-slate-500">
                      Generated on May 1, 2025 • 2.4 MB
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center py-3 px-6">
                  <div>
                    <p className="font-medium">
                      Monthly Payroll Backup - April 2025
                    </p>
                    <p className="text-xs text-slate-500">
                      Generated on Apr 1, 2025 • 2.3 MB
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center py-3 px-6">
                  <div>
                    <p className="font-medium">
                      Quarterly Tax Report - Q1 2025
                    </p>
                    <p className="text-xs text-slate-500">
                      Generated on Apr 15, 2025 • 5.7 MB
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center py-3 px-6">
                  <div>
                    <p className="font-medium">
                      Monthly Payroll Backup - March 2025
                    </p>
                    <p className="text-xs text-slate-500">
                      Generated on Mar 1, 2025 • 2.2 MB
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollReports;
