import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, Eye, EyeOff, Copy, Shield } from "lucide-react";

const WifiCredentials = () => {
  const [showPasswords, setShowPasswords] = React.useState({});

  const wifiNetworks = [
    {
      id: 1,
      name: "CompanyOffice-Main",
      password: "SecurePass2025!",
      type: "Main Network",
      location: "All Floors",
      speed: "1 Gbps",
      status: "Active",
    },
    {
      id: 2,
      name: "CompanyOffice-Guest",
      password: "GuestAccess123",
      type: "Guest Network",
      location: "Reception & Meeting Rooms",
      speed: "100 Mbps",
      status: "Active",
    },
    {
      id: 3,
      name: "CompanyOffice-5G",
      password: "HighSpeed5G!",
      type: "5G Network",
      location: "Executive Floor",
      speed: "2 Gbps",
      status: "Active",
    },
  ];

  const togglePasswordVisibility = (id) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          WiFi & Credentials
        </h1>
        <p className="text-slate-500 mt-1">
          Access office WiFi networks and credentials
        </p>
      </div>

      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-amber-800">Security Notice</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-amber-700">
            Please keep these credentials confidential and do not share them
            with unauthorized personnel. If you suspect any security issues,
            contact IT support immediately.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wifiNetworks.map((network) => (
          <Card key={network.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Wifi className="h-6 w-6 text-blue-500" />
                <Badge
                  variant={
                    network.status === "Active" ? "default" : "secondary"
                  }
                >
                  {network.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{network.name}</CardTitle>
              <CardDescription>{network.type}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-medium">{network.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Speed:</span>
                  <span className="font-medium">{network.speed}</span>
                </div>
              </div>

              <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Password:
                  </span>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePasswordVisibility(network.id)}
                    >
                      {showPasswords[network.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(network.password)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="font-mono text-sm bg-white p-2 rounded border">
                  {showPasswords[network.id]
                    ? network.password
                    : "••••••••••••"}
                </div>
              </div>

              <Button variant="outline" className="w-full" size="sm">
                <Wifi className="h-4 w-4 mr-2" />
                Connect to Network
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connection Instructions</CardTitle>
          <CardDescription>
            How to connect to the office WiFi networks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">For Windows:</h4>
            <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1 ml-4">
              <li>Click on the WiFi icon in the system tray</li>
              <li>Select the network name from the list</li>
              <li>Enter the password when prompted</li>
              <li>Click "Connect"</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">For Mac:</h4>
            <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1 ml-4">
              <li>Click the WiFi icon in the menu bar</li>
              <li>Select the network name</li>
              <li>Enter the password</li>
              <li>Click "Join"</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">For Mobile Devices:</h4>
            <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1 ml-4">
              <li>Go to Settings → WiFi</li>
              <li>Tap on the network name</li>
              <li>Enter the password</li>
              <li>Tap "Connect" or "Join"</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WifiCredentials;
