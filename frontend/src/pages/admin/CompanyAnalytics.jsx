import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  UserPlus,
  UserMinus,
  Target,
  Award,
} from "lucide-react";

const CompanyAnalytics = () => {
  // Mock data for charts
  const monthlyData = [
    { month: "Jan", employees: 45, revenue: 125000, expenses: 85000 },
    { month: "Feb", employees: 48, revenue: 135000, expenses: 90000 },
    { month: "Mar", employees: 52, revenue: 142000, expenses: 95000 },
    { month: "Apr", employees: 55, revenue: 148000, expenses: 98000 },
    { month: "May", employees: 58, revenue: 155000, expenses: 102000 },
    { month: "Jun", employees: 62, revenue: 162000, expenses: 108000 },
  ];

  const departmentData = [
    { name: "Engineering", value: 35, color: "#8884d8" },
    { name: "Marketing", value: 15, color: "#82ca9d" },
    { name: "Sales", value: 20, color: "#ffc658" },
    { name: "HR", value: 8, color: "#ff7300" },
    { name: "Finance", value: 12, color: "#00c49f" },
    { name: "Operations", value: 10, color: "#0088fe" },
  ];

  const performanceData = [
    { month: "Jan", satisfaction: 4.2, productivity: 85, retention: 92 },
    { month: "Feb", satisfaction: 4.3, productivity: 87, retention: 94 },
    { month: "Mar", satisfaction: 4.1, productivity: 83, retention: 91 },
    { month: "Apr", satisfaction: 4.4, productivity: 89, retention: 95 },
    { month: "May", satisfaction: 4.5, productivity: 91, retention: 96 },
    { month: "Jun", satisfaction: 4.6, productivity: 93, retention: 97 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Company Analytics</h1>
        <p className="text-slate-500 mt-1">
          Comprehensive insights into company performance and metrics
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Employees
                </p>
                <p className="text-2xl font-bold text-slate-800">62</p>
                <p className="text-xs text-green-600 mt-1">
                  +6 from last month
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
                <p className="text-sm font-medium text-slate-500">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-slate-800">$162K</p>
                <p className="text-xs text-green-600 mt-1">+4.5% growth</p>
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
                  Avg. Productivity
                </p>
                <p className="text-2xl font-bold text-slate-800">93%</p>
                <p className="text-xs text-green-600 mt-1">+2% this month</p>
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
                  Retention Rate
                </p>
                <p className="text-2xl font-bold text-slate-800">97%</p>
                <p className="text-xs text-green-600 mt-1">Industry leading</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Growth</CardTitle>
                <CardDescription>
                  Employee count and revenue trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="employees"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Employees"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>
                  Employee distribution across departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      New Hires
                    </p>
                    <p className="text-2xl font-bold text-green-600">8</p>
                    <p className="text-xs text-slate-500 mt-1">This month</p>
                  </div>
                  <UserPlus className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Departures
                    </p>
                    <p className="text-2xl font-bold text-red-600">2</p>
                    <p className="text-xs text-slate-500 mt-1">This month</p>
                  </div>
                  <UserMinus className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Net Growth
                    </p>
                    <p className="text-2xl font-bold text-blue-600">+6</p>
                    <p className="text-xs text-slate-500 mt-1">This month</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Employee Growth Trend</CardTitle>
              <CardDescription>
                Monthly employee count over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="employees" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Monthly financial performance</CardDescription>
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
                  <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                  <Bar dataKey="expenses" fill="#ff7300" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Employee satisfaction, productivity, and retention trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="satisfaction"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Satisfaction (out of 5)"
                  />
                  <Line
                    type="monotone"
                    dataKey="productivity"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Productivity %"
                  />
                  <Line
                    type="monotone"
                    dataKey="retention"
                    stroke="#ffc658"
                    strokeWidth={2}
                    name="Retention %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyAnalytics;
