import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Wifi,
  Eye,
  EyeOff,
  Globe,
  Key,
  Lock,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

// Mock data for Wi-Fi networks
const WIFI_NETWORKS = [
  {
    id: 1,
    name: "Company_Main",
    password: "C0mp4ny@2025!",
    type: "WPA2-Enterprise",
    notes: "Main office network for all employees",
  },
  {
    id: 2,
    name: "Company_Guest",
    password: "Guest@2025",
    type: "WPA2-Personal",
    notes: "For visitors and guests only",
  },
  {
    id: 3,
    name: "Company_IoT",
    password: "IoT@Device2025",
    type: "WPA2-Personal",
    notes: "For IoT devices and printers",
  },
];

// Mock data for authorized websites and credentials
const AUTHORIZED_WEBSITES = [
  {
    id: 1,
    name: "Company CRM",
    url: "https://crm.company.com",
    username: "employee.id",
    note: "Use your employee ID as username",
  },
  {
    id: 2,
    name: "Travel Booking Portal",
    url: "https://travel.company.com",
    username: "firstname.lastname",
    note: "Use your company email password",
  },
  {
    id: 3,
    name: "Learning Management System",
    url: "https://lms.company.com",
    username: "employee.id",
    note: "Use your employee ID as username",
  },
  {
    id: 4,
    name: "Expense Management",
    url: "https://expenses.company.com",
    username: "firstname.lastname",
    note: "Use SSO for login",
  },
];

const WifiCredentials = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState<
    Record<number, boolean>
  >({});

  const togglePasswordVisibility = (id: number) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied to clipboard`,
      duration: 2000,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          WiFi & Credentials
        </h1>
        <p className="text-slate-500 mt-1">
          Access network and application credentials
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wifi className="mr-2 h-5 w-5 text-hr-primary" />
            WiFi Networks
          </CardTitle>
          <CardDescription>Company WiFi information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {WIFI_NETWORKS.map((network) => (
              <Card key={network.id} className="overflow-hidden">
                <div className="bg-slate-50 p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Wifi className="h-5 w-5 text-hr-primary mr-2" />
                      <h3 className="text-lg font-medium">{network.name}</h3>
                    </div>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                      {network.type}
                    </span>
                  </div>
                </div>

                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-1">
                        Network Name (SSID)
                      </div>
                      <div className="flex">
                        <Input
                          value={network.name}
                          readOnly
                          className="bg-slate-50"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                          onClick={() =>
                            copyToClipboard(network.name, "Network name")
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">Password</div>
                      <div className="flex">
                        <Input
                          type={showPassword[network.id] ? "text" : "password"}
                          value={network.password}
                          readOnly
                          className="bg-slate-50 font-mono"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                          onClick={() => togglePasswordVisibility(network.id)}
                        >
                          {showPassword[network.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-1"
                          onClick={() =>
                            copyToClipboard(network.password, "Password")
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {network.notes && (
                    <div className="text-sm bg-blue-50 text-blue-700 p-2 rounded border border-blue-100">
                      <span className="font-medium">Note:</span> {network.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5 text-hr-primary" />
            Authorized Websites & Credentials
          </CardTitle>
          <CardDescription>
            Access information for company web applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {AUTHORIZED_WEBSITES.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-blue-600 underline mr-1">
                        {site.url}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => window.open(site.url, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{site.username}</TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {site.note}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Key className="h-3 w-3 mr-1" /> Access
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5 text-hr-primary" />
            Security Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-slate-50 rounded-md">
              <p className="font-medium text-red-600">
                Do Not Share Credentials
              </p>
              <p>
                Never share your passwords or credentials with colleagues or
                external parties.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-md">
              <p className="font-medium text-amber-600">Password Changes</p>
              <p>
                Change your passwords every 90 days and don't reuse old
                passwords.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-md">
              <p className="font-medium text-green-600">Strong Passwords</p>
              <p>
                Use a combination of uppercase, lowercase, numbers, and special
                characters.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-md">
              <p className="font-medium text-blue-600">Reporting</p>
              <p>
                Report any suspicious activity to the IT department immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WifiCredentials;
