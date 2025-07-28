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
import { Label } from "@/components/ui/label";
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
  Laptop,
  Monitor,
  Smartphone,
  Printer,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
} from "lucide-react";

const AssetManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data for assets
  const assets = [
    {
      id: "AST001",
      name: 'MacBook Pro 13"',
      category: "Laptop",
      serialNumber: "C02XL123ABC",
      assignedTo: "John Doe",
      status: "Assigned",
      location: "New York Office",
      purchaseDate: "2023-01-15",
      warrantyExpiry: "2026-01-15",
      condition: "Good",
    },
    {
      id: "AST002",
      name: 'Dell UltraSharp 27"',
      category: "Monitor",
      serialNumber: "CN-0ABC123",
      assignedTo: "Jane Smith",
      status: "Assigned",
      location: "Remote",
      purchaseDate: "2023-03-20",
      warrantyExpiry: "2026-03-20",
      condition: "Excellent",
    },
    {
      id: "AST003",
      name: "iPhone 14 Pro",
      category: "Mobile",
      serialNumber: "F2L123ABC45",
      assignedTo: null,
      status: "Available",
      location: "IT Storage",
      purchaseDate: "2023-09-10",
      warrantyExpiry: "2024-09-10",
      condition: "New",
    },
    {
      id: "AST004",
      name: "HP LaserJet Pro",
      category: "Printer",
      serialNumber: "CN12345678",
      assignedTo: null,
      status: "Maintenance",
      location: "Main Office",
      purchaseDate: "2022-06-15",
      warrantyExpiry: "2024-06-15",
      condition: "Fair",
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      Assigned: { color: "bg-green-100 text-green-800", text: "Assigned" },
      Available: { color: "bg-blue-100 text-blue-800", text: "Available" },
      Maintenance: {
        color: "bg-yellow-100 text-yellow-800",
        text: "Maintenance",
      },
      Retired: { color: "bg-red-100 text-red-800", text: "Retired" },
    };

    const config = statusConfig[status] || statusConfig["Available"];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      Laptop: <Laptop className="h-4 w-4" />,
      Monitor: <Monitor className="h-4 w-4" />,
      Mobile: <Smartphone className="h-4 w-4" />,
      Printer: <Printer className="h-4 w-4" />,
    };
    return iconMap[category] || <Laptop className="h-4 w-4" />;
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      asset.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Asset Management</h1>
        <p className="text-slate-500 mt-1">
          Track and manage company assets and equipment
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Assets
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {assets.length}
                </p>
              </div>
              <Laptop className="h-8 w-8 text-hr-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Assigned</p>
                <p className="text-2xl font-bold text-green-600">
                  {assets.filter((a) => a.status === "Assigned").length}
                </p>
              </div>
              <Monitor className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Available</p>
                <p className="text-2xl font-bold text-blue-600">
                  {assets.filter((a) => a.status === "Available").length}
                </p>
              </div>
              <Smartphone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Maintenance
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {assets.filter((a) => a.status === "Maintenance").length}
                </p>
              </div>
              <Printer className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Asset Inventory</CardTitle>
              <CardDescription>
                Manage your company's assets and equipment
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
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
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Categories</option>
              <option value="laptop">Laptops</option>
              <option value="monitor">Monitors</option>
              <option value="mobile">Mobile Devices</option>
              <option value="printer">Printers</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(asset.category)}
                        {asset.name}
                      </div>
                    </TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {asset.serialNumber}
                    </TableCell>
                    <TableCell>{asset.assignedTo || "-"}</TableCell>
                    <TableCell>{getStatusBadge(asset.status)}</TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{asset.condition}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetManagement;
