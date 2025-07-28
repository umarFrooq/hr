import React from "react";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  User,
  Palette,
  Globe,
} from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = React.useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    darkMode: false,
    language: "en",
    timezone: "UTC-8",
  });

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage your account preferences and notifications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-500" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>
                Control how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-slate-500">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting("emailNotifications", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-slate-500">
                    Browser push notifications
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting("pushNotifications", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-sm text-slate-500">
                    Weekly activity summary
                  </p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) =>
                    updateSetting("weeklyReports", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-purple-500" />
                <CardTitle>Appearance</CardTitle>
              </div>
              <CardDescription>Customize your interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-slate-500">Switch to dark theme</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) =>
                    updateSetting("darkMode", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-green-500" />
                <CardTitle>Language & Region</CardTitle>
              </div>
              <CardDescription>Set your language and timezone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  className="w-full p-2 border border-slate-300 rounded-md"
                  value={settings.language}
                  onChange={(e) => updateSetting("language", e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="w-full p-2 border border-slate-300 rounded-md"
                  value={settings.timezone}
                  onChange={(e) => updateSetting("timezone", e.target.value)}
                >
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-7">Mountain Time (UTC-7)</option>
                  <option value="UTC-6">Central Time (UTC-6)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-500" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Manage your security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full">
                Active Sessions
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-orange-500" />
                <CardTitle>Account</CardTitle>
              </div>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  placeholder="Your display name"
                  defaultValue="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  defaultValue="john.doe@company.com"
                />
              </div>

              <Button className="w-full">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                Export My Data
              </Button>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
