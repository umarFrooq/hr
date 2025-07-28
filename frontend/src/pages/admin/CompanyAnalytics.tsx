import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Users,
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  FileBarChart,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CompanyAnalytics = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Company Analytics</h1>
        <p className="text-slate-500 mt-1">
          Overview of key company metrics and performance indicators
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Employees
                </p>
                <p className="text-3xl font-bold mt-1">142</p>
                <p className="text-xs text-green-600 mt-1">
                  +3.5% from last month
                </p>
              </div>
              <div className="bg-blue-50 p-2 rounded-md">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Avg. Retention
                </p>
                <p className="text-3xl font-bold mt-1">2.3 yrs</p>
                <p className="text-xs text-green-600 mt-1">
                  +0.2 yrs from last year
                </p>
              </div>
              <div className="bg-green-50 p-2 rounded-md">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Productivity
                </p>
                <p className="text-3xl font-bold mt-1">87.5%</p>
                <p className="text-xs text-green-600 mt-1">
                  +2.3% from last quarter
                </p>
              </div>
              <div className="bg-purple-50 p-2 rounded-md">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Revenue per Employee
                </p>
                <p className="text-3xl font-bold mt-1">$195K</p>
                <p className="text-xs text-amber-600 mt-1">
                  -0.8% from last quarter
                </p>
              </div>
              <div className="bg-amber-50 p-2 rounded-md">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workforce">
        <TabsList className="grid grid-cols-4 mb-8 w-full max-w-2xl">
          <TabsTrigger value="workforce">Workforce</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="workforce" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-hr-primary" />
                    Workforce Distribution
                  </CardTitle>
                  <CardDescription>
                    Employee breakdown by department and role
                  </CardDescription>
                </div>
                <Select defaultValue="may-2025">
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="may-2025">May 2025</SelectItem>
                    <SelectItem value="apr-2025">April 2025</SelectItem>
                    <SelectItem value="q1-2025">Q1 2025</SelectItem>
                    <SelectItem value="2024">Year 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 rounded-md mb-6">
                <div className="text-center">
                  <p className="text-slate-500">
                    Department distribution chart would appear here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    (Visualization placeholder)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Department Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-1/3 text-sm">Engineering</div>
                      <div className="w-1/2">
                        <div className="h-2 bg-slate-100 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: "35%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-1/6 text-right text-sm">35%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1/3 text-sm">Sales</div>
                      <div className="w-1/2">
                        <div className="h-2 bg-slate-100 rounded-full">
                          <div
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: "25%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-1/6 text-right text-sm">25%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1/3 text-sm">Marketing</div>
                      <div className="w-1/2">
                        <div className="h-2 bg-slate-100 rounded-full">
                          <div
                            className="h-2 bg-purple-500 rounded-full"
                            style={{ width: "20%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-1/6 text-right text-sm">20%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1/3 text-sm">Operations</div>
                      <div className="w-1/2">
                        <div className="h-2 bg-slate-100 rounded-full">
                          <div
                            className="h-2 bg-amber-500 rounded-full"
                            style={{ width: "15%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-1/6 text-right text-sm">15%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1/3 text-sm">HR & Admin</div>
                      <div className="w-1/2">
                        <div className="h-2 bg-slate-100 rounded-full">
                          <div
                            className="h-2 bg-red-500 rounded-full"
                            style={{ width: "5%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-1/6 text-right text-sm">5%</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Employment Type</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-1/3 text-sm">Full-time</div>
                      <div className="w-1/2">
                        <div className="h-2 bg-slate-100 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-1/6 text-right text-sm">75%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1/3 text-sm">Contract</div>
                      <div className="w-1/2">
                        <div className="h-2 bg-slate-100 rounded-full">
                          <div
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: "15%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-1/6 text-right text-sm">15%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1/3 text-sm">Part-time</div>
                      <div className="w-1/2">
                        <div className="h-2 bg-slate-100 rounded-full">
                          <div
                            className="h-2 bg-purple-500 rounded-full"
                            style={{ width: "8%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-1/6 text-right text-sm">8%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1/3 text-sm">Intern</div>
                      <div className="w-1/2">
                        <div className="h-2 bg-slate-100 rounded-full">
                          <div
                            className="h-2 bg-amber-500 rounded-full"
                            style={{ width: "2%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-1/6 text-right text-sm">2%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiring & Turnover</CardTitle>
                <CardDescription>
                  Employee acquisition and turnover rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center border border-dashed border-slate-200 rounded-md mb-4">
                  <p className="text-slate-500">
                    Hiring vs turnover chart would appear here
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-md">
                    <p className="text-xs text-slate-500">New Hires (YTD)</p>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-xs text-green-600">+8% from last year</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md">
                    <p className="text-xs text-slate-500">Turnover Rate</p>
                    <p className="text-2xl font-bold">12%</p>
                    <p className="text-xs text-amber-600">+2% from last year</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employee Demographics</CardTitle>
                <CardDescription>Age and gender distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center border border-dashed border-slate-200 rounded-md mb-4">
                  <p className="text-slate-500">
                    Demographics chart would appear here
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-md">
                    <p className="text-xs text-slate-500">Average Age</p>
                    <p className="text-2xl font-bold">34.5</p>
                    <p className="text-xs text-slate-500">years</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md">
                    <p className="text-xs text-slate-500">Gender Ratio</p>
                    <p className="text-2xl font-bold">45:55</p>
                    <p className="text-xs text-slate-500">F:M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-hr-primary" />
                    Productivity Metrics
                  </CardTitle>
                  <CardDescription>
                    Performance and efficiency indicators
                  </CardDescription>
                </div>
                <Select defaultValue="may-2025">
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="may-2025">May 2025</SelectItem>
                    <SelectItem value="apr-2025">April 2025</SelectItem>
                    <SelectItem value="q1-2025">Q1 2025</SelectItem>
                    <SelectItem value="2024">Year 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 rounded-md mb-6">
                <div className="text-center">
                  <p className="text-slate-500">
                    Productivity trend chart would appear here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    (Visualization placeholder)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-md text-center">
                  <p className="text-xs text-slate-500 uppercase">
                    Avg. Work Hours
                  </p>
                  <p className="text-2xl font-bold">7.5</p>
                  <p className="text-xs">hrs/day</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-md text-center">
                  <p className="text-xs text-slate-500 uppercase">
                    Task Completion
                  </p>
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-xs">on-time delivery</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-md text-center">
                  <p className="text-xs text-slate-500 uppercase">
                    Meeting Efficiency
                  </p>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-xs">productive time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Efficiency</CardTitle>
                <CardDescription>Productivity by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Engineering</span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: "94%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Marketing</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: "87%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Sales</span>
                      <span className="text-sm font-medium">79%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-2 bg-amber-500 rounded-full"
                        style={{ width: "79%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Operations</span>
                      <span className="text-sm font-medium">91%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: "91%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance & Leave</CardTitle>
                <CardDescription>
                  Attendance rates and leave statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center border border-dashed border-slate-200 rounded-md mb-4">
                  <p className="text-slate-500">
                    Attendance chart would appear here
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-3 rounded-md text-center">
                    <p className="text-xs text-slate-500">Attendance</p>
                    <p className="text-xl font-bold">97.5%</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md text-center">
                    <p className="text-xs text-slate-500">Sick Leave</p>
                    <p className="text-xl font-bold">1.5%</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md text-center">
                    <p className="text-xs text-slate-500">Planned Leave</p>
                    <p className="text-xl font-bold">1.0%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-hr-primary" />
                    Financial Metrics
                  </CardTitle>
                  <CardDescription>Revenue and cost analysis</CardDescription>
                </div>
                <Select defaultValue="q1-2025">
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="may-2025">May 2025</SelectItem>
                    <SelectItem value="q1-2025">Q1 2025</SelectItem>
                    <SelectItem value="q4-2024">Q4 2024</SelectItem>
                    <SelectItem value="2024">Year 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 rounded-md mb-6">
                <div className="text-center">
                  <p className="text-slate-500">
                    Revenue vs costs chart would appear here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    (Visualization placeholder)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-md">
                  <p className="text-xs text-slate-500 uppercase">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold">$7.2M</p>
                  <p className="text-xs text-green-600">+12% from last year</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-md">
                  <p className="text-xs text-slate-500 uppercase">
                    Total Costs
                  </p>
                  <p className="text-2xl font-bold">$5.3M</p>
                  <p className="text-xs text-amber-600">+8% from last year</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-md">
                  <p className="text-xs text-slate-500 uppercase">Net Profit</p>
                  <p className="text-2xl font-bold">$1.9M</p>
                  <p className="text-xs text-green-600">+15% from last year</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>HR Cost Analysis</CardTitle>
                <CardDescription>Employee-related costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center border border-dashed border-slate-200 rounded-md mb-4">
                  <p className="text-slate-500">
                    HR cost breakdown chart would appear here
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-1/3 text-sm">Salaries</div>
                    <div className="w-1/2">
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/6 text-right text-sm">65%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/3 text-sm">Benefits</div>
                    <div className="w-1/2">
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: "20%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/6 text-right text-sm">20%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/3 text-sm">Training</div>
                    <div className="w-1/2">
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-amber-500 rounded-full"
                          style={{ width: "10%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/6 text-right text-sm">10%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/3 text-sm">Other</div>
                    <div className="w-1/2">
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-purple-500 rounded-full"
                          style={{ width: "5%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/6 text-right text-sm">5%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost per Employee</CardTitle>
                <CardDescription>By department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Engineering</span>
                      <span className="text-sm font-medium">$105,750</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: "95%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Sales</span>
                      <span className="text-sm font-medium">$98,200</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Marketing</span>
                      <span className="text-sm font-medium">$87,500</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Operations</span>
                      <span className="text-sm font-medium">$75,300</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">HR & Admin</span>
                      <span className="text-sm font-medium">$68,900</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-hr-primary" />
                    Growth Metrics
                  </CardTitle>
                  <CardDescription>Company growth indicators</CardDescription>
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter Data
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 rounded-md mb-6">
                <div className="text-center">
                  <p className="text-slate-500">
                    Growth trend chart would appear here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    (Visualization placeholder)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-md text-center">
                  <p className="text-xs text-slate-500 uppercase">
                    Headcount Growth
                  </p>
                  <p className="text-2xl font-bold">+15%</p>
                  <p className="text-xs">YoY</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-md text-center">
                  <p className="text-xs text-slate-500 uppercase">
                    Revenue Growth
                  </p>
                  <p className="text-2xl font-bold">+22%</p>
                  <p className="text-xs">YoY</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-md text-center">
                  <p className="text-xs text-slate-500 uppercase">
                    Market Share
                  </p>
                  <p className="text-2xl font-bold">12.5%</p>
                  <p className="text-xs">+2.3% YoY</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-md text-center">
                  <p className="text-xs text-slate-500 uppercase">
                    Customer Growth
                  </p>
                  <p className="text-2xl font-bold">+18%</p>
                  <p className="text-xs">YoY</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expansion Analysis</CardTitle>
                <CardDescription>Growth by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center border border-dashed border-slate-200 rounded-md mb-4">
                  <p className="text-slate-500">
                    Regional growth chart would appear here
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-1/3 text-sm">North America</div>
                    <div className="w-1/2">
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: "18%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/6 text-right text-sm">+18%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/3 text-sm">Europe</div>
                    <div className="w-1/2">
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: "27%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/6 text-right text-sm">+27%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/3 text-sm">Asia Pacific</div>
                    <div className="w-1/2">
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: "32%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/6 text-right text-sm">+32%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/3 text-sm">Latin America</div>
                    <div className="w-1/2">
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-amber-500 rounded-full"
                          style={{ width: "9%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/6 text-right text-sm">+9%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reports & Analysis</CardTitle>
                <CardDescription>Download detailed reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                  <div className="flex items-center">
                    <FileBarChart className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium">Q1 2025 Growth Report</p>
                      <p className="text-xs text-slate-500">
                        PDF • Generated May 2, 2025
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-green-600" />
                    <div>
                      <p className="font-medium">Workforce Expansion Plan</p>
                      <p className="text-xs text-slate-500">
                        XLSX • Generated Apr 15, 2025
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 mr-3 text-purple-600" />
                    <div>
                      <p className="font-medium">2024 Annual Analytics</p>
                      <p className="text-xs text-slate-500">
                        PDF • Generated Jan 31, 2025
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyAnalytics;
