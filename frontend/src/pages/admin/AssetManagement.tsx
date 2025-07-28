import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Box,
  Laptop,
  Monitor,
  Smartphone,
  Printer,
  Headphones,
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  User,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Sample asset data
const ASSETS = [
  {
    id: "A001",
    name: 'MacBook Pro 16"',
    type: "Laptop",
    status: "Assigned",
    assignedTo: "John Doe",
    department: "Engineering",
    purchaseDate: "2023-05-15",
    value: "$2,499",
    condition: "Excellent",
  },
  {
    id: "A002",
    name: "Dell XPS 15",
    type: "Laptop",
    status: "Assigned",
    assignedTo: "Emily Rodriguez",
    department: "Marketing",
    purchaseDate: "2023-03-22",
    value: "$1,899",
    condition: "Good",
  },
  {
    id: "A003",
    name: "iPhone 14 Pro",
    type: "Mobile",
    status: "Assigned",
    assignedTo: "Sarah Wilson",
    department: "Sales",
    purchaseDate: "2023-09-30",
    value: "$999",
    condition: "Excellent",
  },
  {
    id: "A004",
    name: 'Dell UltraSharp 27"',
    type: "Monitor",
    status: "Available",
    assignedTo: "",
    department: "IT",
    purchaseDate: "2023-01-15",
    value: "$499",
    condition: "Good",
  },
  {
    id: "A005",
    name: "HP LaserJet Pro",
    type: "Printer",
    status: "Maintenance",
    assignedTo: "",
    department: "Office",
    purchaseDate: "2022-11-10",
    value: "$349",
    condition: "Fair",
  },
  {
    id: "A006",
    name: "Sony WH-1000XM5",
    type: "Headphones",
    status: "Assigned",
    assignedTo: "Mike Chen",
    department: "Engineering",
    purchaseDate: "2024-02-28",
    value: "$399",
    condition: "Excellent",
  },
  {
    id: "A007",
    name: 'iPad Pro 12.9"',
    type: "Tablet",
    status: "Assigned",
    assignedTo: "Lisa Wong",
    department: "Design",
    purchaseDate: "2023-07-15",
    value: "$1,099",
    condition: "Good",
  },
];

const AssetManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Get asset icon based on type
  const getAssetIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "laptop":
        return <Laptop className="h-4 w-4 text-blue-500" />;
      case "mobile":
        return <Smartphone className="h-4 w-4 text-green-500" />;
      case "monitor":
        return <Monitor className="h-4 w-4 text-purple-500" />;
      case "printer":
        return <Printer className="h-4 w-4 text-red-500" />;
      case "headphones":
        return <Headphones className="h-4 w-4 text-amber-500" />;
      default:
        return <Box className="h-4 w-4 text-slate-500" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "assigned":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Assigned
          </Badge>
        );
      case "available":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Available
          </Badge>
        );
      case "maintenance":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            Maintenance
          </Badge>
        );
      case "retired":
        return (
          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-700 border-slate-200"
          >
            Retired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter assets based on search
  const filteredAssets = ASSETS.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Asset Management</h1>
        <p className="text-slate-500 mt-1">
          Manage company equipment and assets
        </p>
      </div>

      <Tabs defaultValue="inventory">
        <TabsList className="grid grid-cols-3 mb-8 w-full max-w-lg">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search assets by name, ID or assignee..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Asset
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Add New Asset</DialogTitle>
                        <DialogDescription>
                          Enter details for the new asset to add to inventory.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="asset-id" className="text-right">
                            Asset ID
                          </Label>
                          <Input
                            id="asset-id"
                            placeholder="Auto-generated"
                            className="col-span-3"
                            disabled
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="asset-name" className="text-right">
                            Asset Name
                          </Label>
                          <Input
                            id="asset-name"
                            placeholder='e.g. MacBook Pro 16"'
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="asset-type" className="text-right">
                            Type
                          </Label>
                          <Select>
                            <SelectTrigger
                              id="asset-type"
                              className="col-span-3"
                            >
                              <SelectValue placeholder="Select asset type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="laptop">Laptop</SelectItem>
                              <SelectItem value="mobile">Mobile</SelectItem>
                              <SelectItem value="tablet">Tablet</SelectItem>
                              <SelectItem value="monitor">Monitor</SelectItem>
                              <SelectItem value="printer">Printer</SelectItem>
                              <SelectItem value="headphones">
                                Headphones
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="purchase-date" className="text-right">
                            Purchase Date
                          </Label>
                          <Input
                            id="purchase-date"
                            type="date"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="asset-value" className="text-right">
                            Value
                          </Label>
                          <Input
                            id="asset-value"
                            placeholder="e.g. $1,299"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="department" className="text-right">
                            Department
                          </Label>
                          <Select>
                            <SelectTrigger
                              id="department"
                              className="col-span-3"
                            >
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="engineering">
                                Engineering
                              </SelectItem>
                              <SelectItem value="marketing">
                                Marketing
                              </SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="design">Design</SelectItem>
                              <SelectItem value="hr">HR</SelectItem>
                              <SelectItem value="it">IT</SelectItem>
                              <SelectItem value="office">Office</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="status" className="text-right">
                            Status
                          </Label>
                          <Select defaultValue="available">
                            <SelectTrigger id="status" className="col-span-3">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">
                                Available
                              </SelectItem>
                              <SelectItem value="assigned">Assigned</SelectItem>
                              <SelectItem value="maintenance">
                                Maintenance
                              </SelectItem>
                              <SelectItem value="retired">Retired</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="notes" className="text-right">
                            Notes
                          </Label>
                          <Textarea
                            id="notes"
                            placeholder="Additional information about this asset"
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={() => setIsAddDialogOpen(false)}>
                          Add Asset
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="text-left p-3 text-xs font-medium text-slate-500">
                        <div className="flex items-center cursor-pointer">
                          ID
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-slate-500">
                        <div className="flex items-center cursor-pointer">
                          Asset
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-slate-500">
                        <div className="flex items-center cursor-pointer">
                          Status
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-slate-500">
                        <div className="flex items-center cursor-pointer">
                          Assigned To
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-slate-500 hidden md:table-cell">
                        <div className="flex items-center cursor-pointer">
                          Department
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-slate-500 hidden lg:table-cell">
                        <div className="flex items-center cursor-pointer">
                          Value
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-center p-3 text-xs font-medium text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map((asset) => (
                      <tr key={asset.id} className="border-b">
                        <td className="p-3 text-sm">{asset.id}</td>
                        <td className="p-3">
                          <div className="flex items-center">
                            {getAssetIcon(asset.type)}
                            <div className="ml-2">
                              <div className="font-medium text-sm">
                                {asset.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {asset.type}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">{getStatusBadge(asset.status)}</td>
                        <td className="p-3">
                          {asset.assignedTo ? (
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1 text-slate-400" />
                              <span className="text-sm">
                                {asset.assignedTo}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-500">—</span>
                          )}
                        </td>
                        <td className="p-3 hidden md:table-cell text-sm">
                          {asset.department}
                        </td>
                        <td className="p-3 hidden lg:table-cell text-sm">
                          {asset.value}
                        </td>
                        <td className="p-3 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Asset</DropdownMenuItem>
                              <DropdownMenuItem>
                                Assign to User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                Mark as Maintenance
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Retire Asset
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAssets.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-slate-500">
                    No assets matched your search criteria
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-blue-50 p-3 mb-2">
                    <Laptop className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold">25</p>
                  <p className="text-sm text-slate-500">Laptops</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-green-50 p-3 mb-2">
                    <Smartphone className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-sm text-slate-500">Mobile Devices</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-purple-50 p-3 mb-2">
                    <Monitor className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold">32</p>
                  <p className="text-sm text-slate-500">Monitors</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-amber-50 p-3 mb-2">
                    <Headphones className="h-6 w-6 text-amber-600" />
                  </div>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-sm text-slate-500">Accessories</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Requests</CardTitle>
              <CardDescription>
                Manage requests for new equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="text-left p-3 text-xs font-medium text-slate-500">
                        Request ID
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-slate-500">
                        Employee
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-slate-500">
                        Asset Type
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-slate-500">
                        Date Requested
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-slate-500">
                        Status
                      </th>
                      <th className="text-center p-3 text-xs font-medium text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 text-sm">REQ-001</td>
                      <td className="p-3 text-sm">Alex Johnson</td>
                      <td className="p-3 text-sm">Laptop</td>
                      <td className="p-3 text-sm">May 18, 2025</td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          Pending
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-sm">REQ-002</td>
                      <td className="p-3 text-sm">Emily Rodriguez</td>
                      <td className="p-3 text-sm">Monitor</td>
                      <td className="p-3 text-sm">May 15, 2025</td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          Approved
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm" disabled>
                            Approve
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-sm">REQ-003</td>
                      <td className="p-3 text-sm">Mike Chen</td>
                      <td className="p-3 text-sm">Headphones</td>
                      <td className="p-3 text-sm">May 10, 2025</td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          Pending
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Reports</CardTitle>
              <CardDescription>
                Generate reports for inventory analysis
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
                      <SelectValue placeholder="Select report" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inventory">
                        Inventory Summary
                      </SelectItem>
                      <SelectItem value="assignments">
                        Asset Assignments
                      </SelectItem>
                      <SelectItem value="depreciation">
                        Depreciation Schedule
                      </SelectItem>
                      <SelectItem value="maintenance">
                        Maintenance History
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Department
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
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
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Distribution</CardTitle>
                <CardDescription>By department</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <p className="text-slate-500">
                  Department distribution chart would appear here
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Value</CardTitle>
                <CardDescription>By category</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <p className="text-slate-500">
                  Asset value chart would appear here
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetManagement;
