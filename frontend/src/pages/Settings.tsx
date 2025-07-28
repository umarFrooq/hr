import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/hooks/useUserSettings";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { toast } = useToast();
  const { settings, updateSettings, loading, refetch } = useUserSettings();
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [sessionTimeout, setSessionTimeout] = React.useState("30");
  const [notifPrefs, setNotifPrefs] = React.useState<any>({});
  const [theme, setTheme] = React.useState("light");
  const [accent, setAccent] = React.useState("hr-primary");
  const [fontSize, setFontSize] = React.useState("medium");
  const [animations, setAnimations] = React.useState(true);
  const [notifyLoading, setNotifyLoading] = React.useState(false);
  const [appLoading, setAppLoading] = React.useState(false);

  // On settings load, reflect values in state
  React.useEffect(() => {
    if (!loading && settings) {
      setTwoFactor(settings.two_factor_enabled);
      setSessionTimeout(settings.session_timeout_minutes.toString());
      setNotifPrefs(settings.notification_prefs || {});
      setTheme(settings.theme);
      setAccent(settings.accent_color);
      setFontSize(settings.font_size);
      setAnimations(settings.animations_enabled);
    }
  }, [loading, settings]);

  // ---- HANDLERS -----
  const handleTwoFactorChange = async (checked: boolean) => {
    setTwoFactor(checked);
    await updateSettings({ two_factor_enabled: checked });
    toast({ title: "Two-Factor Authentication updated", duration: 2000 });
  };

  const handleSessionTimeoutChange = async (val: string) => {
    setSessionTimeout(val);
    await updateSettings({ session_timeout_minutes: Number(val) });
    toast({ title: "Session timeout updated", duration: 2000 });
  };

  const handleResetPassword = async () => {
    setAppLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Not logged in.", variant: "destructive" });
      setAppLoading(false);
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(
      user.email as string,
    );
    setAppLoading(false);
    if (error) {
      toast({
        title: "Failed to send reset email.",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Password reset email sent!" });
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone!",
      )
    )
      return;
    setAppLoading(true);
    // 1. Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Not logged in.", variant: "destructive" });
      setAppLoading(false);
      return;
    }
    // 2. Delete user from app "users" table
    await supabase.from("users").delete().eq("email", user.email);
    // 3. Delete their user_settings row (cascades), and remove Supabase user (need admin service role usually, so logout)
    await supabase.auth.signOut({ scope: "global" });
    // Clean up storage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("supabase.auth.") || key.includes("sb-"))
        localStorage.removeItem(key);
    });
    window.location.href = "/auth";
  };

  const handleNotificationPrefsSave = async () => {
    setNotifyLoading(true);
    await updateSettings({ notification_prefs: notifPrefs });
    setNotifyLoading(false);
    toast({ title: "Notification preferences saved" });
  };

  const handleAppearanceSave = async () => {
    setAppLoading(true);
    await updateSettings({
      theme,
      accent_color: accent,
      font_size: fontSize,
      animations_enabled: animations,
    });
    setAppLoading(false);
    toast({ title: "Appearance settings updated" });
  };

  // --- UI helpers for notification toggles ---
  function makeNotifHandler(key: string, channel: "email" | "sms" | "push") {
    return (val: boolean) => {
      setNotifPrefs((prev: any) => ({
        ...prev,
        [key]: { ...prev[key], [channel]: val },
      }));
    };
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage your application preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-[400px] mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-slate-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={twoFactor}
                    onCheckedChange={handleTwoFactorChange}
                    disabled={loading || appLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Session Timeout</h3>
                    <p className="text-sm text-slate-500">
                      Automatically log out after period of inactivity
                    </p>
                  </div>
                  <Select
                    value={sessionTimeout}
                    onValueChange={handleSessionTimeoutChange}
                    disabled={loading || appLoading}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Password Reset</h3>
                    <p className="text-sm text-slate-500">
                      Reset your password
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleResetPassword}
                    disabled={appLoading || loading}
                  >
                    Reset Password
                  </Button>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-red-600">Delete Account</h3>
                    <p className="text-sm text-slate-500">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={appLoading || loading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>
                Manage accounts you've connected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-slate-100 p-2 h-10 w-10 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-600">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Google</h4>
                    <p className="text-sm text-slate-500">Connected</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({
                      title:
                        "OAuth connection/disconnect isn't supported in this demo. Please use login/signup via Google from Auth page.",
                      duration: 4000,
                    })
                  }
                  disabled={loading || appLoading}
                >
                  Disconnect
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-slate-100 p-2 h-10 w-10 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-600">
                      <path
                        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">GitHub</h4>
                    <p className="text-sm text-slate-500">Not connected</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({
                      title:
                        "OAuth connection is only available via the Auth page.",
                      duration: 4000,
                    })
                  }
                  disabled={loading || appLoading}
                >
                  Connect
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-slate-100 p-2 h-10 w-10 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-600">
                      <path
                        d="M22 5.16c-.406.883-1.066 1.642-1.816 2.242v.578c0 5.98-4.55 12.88-12.88 12.88-2.55 0-4.93-.738-6.934-2.012a9.01 9.01 0 0 0 6.625-1.85 4.48 4.48 0 0 1-4.18-3.102c.7.133 1.398.066 2.056-.164a4.48 4.48 0 0 1-3.597-4.396v-.062c.605.335 1.3.536 2.016.559a4.48 4.48 0 0 1-1.385-5.98A12.73 12.73 0 0 0 11.67 9.75a4.47 4.47 0 0 1 7.52-3.786 8.96 8.96 0 0 0 2.836-1.082 4.499 4.499 0 0 1-1.965 2.46A8.987 8.987 0 0 0 22 6.41a9.08 9.08 0 0 1-2.23 2.308z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Twitter</h4>
                    <p className="text-sm text-slate-500">Not connected</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({
                      title:
                        "OAuth connection is only available via the Auth page.",
                      duration: 4000,
                    })
                  }
                  disabled={loading || appLoading}
                >
                  Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* notification preferences UI with Switches controlled and linked to notifPrefs */}
                {[
                  {
                    key: "leave",
                    label: "Leave Approvals",
                    desc: "When your leave request is approved or rejected",
                  },
                  {
                    key: "payslip",
                    label: "Payslip Ready",
                    desc: "When your new salary slip is available",
                  },
                  {
                    key: "review",
                    label: "Performance Reviews",
                    desc: "When it's time for your review or when feedback is added",
                  },
                  {
                    key: "docs",
                    label: "New Documents",
                    desc: "When new documents are shared with you",
                  },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="grid grid-cols-4 gap-4 py-4 border-t"
                  >
                    <div className="col-span-4 sm:col-span-1">
                      <Label className="text-sm font-medium">{label}</Label>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Switch
                        id={`${key}-email`}
                        checked={!!notifPrefs[key]?.email}
                        onCheckedChange={makeNotifHandler(key, "email")}
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Switch
                        id={`${key}-sms`}
                        checked={!!notifPrefs[key]?.sms}
                        onCheckedChange={makeNotifHandler(key, "sms")}
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Switch
                        id={`${key}-push`}
                        checked={!!notifPrefs[key]?.push}
                        onCheckedChange={makeNotifHandler(key, "push")}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleNotificationPrefsSave}
                  disabled={notifyLoading}
                >
                  {notifyLoading ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { val: "light", display: "Light" },
                      { val: "dark", display: "Dark" },
                      { val: "system", display: "System" },
                    ].map((opt) => (
                      <div
                        key={opt.val}
                        className={`border rounded-md p-3 cursor-pointer ${theme === opt.val ? "border-primary ring-2 ring-primary" : ""}`}
                        onClick={() => setTheme(opt.val)}
                      >
                        {/* ... keep the existing preview blocks ... */}
                        <p className="text-center mt-2 text-sm font-medium">
                          {opt.display}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      "hr-primary",
                      "purple-500",
                      "green-500",
                      "red-500",
                      "amber-500",
                      "slate-700",
                    ].map((c) => (
                      <div
                        key={c}
                        className={`w-8 h-8 rounded-full border-2 ${accent === c ? "ring-2 ring-primary" : ""} bg-${c} shadow-sm cursor-pointer`}
                        style={{ backgroundColor: c.includes("-") ? "" : c }}
                        onClick={() => setAccent(c)}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Animations</Label>
                    <Switch
                      defaultChecked={animations}
                      checked={animations}
                      onCheckedChange={setAnimations}
                    />
                  </div>
                  <p className="text-sm text-slate-500">
                    Enable animations and transitions
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleAppearanceSave}
                    disabled={appLoading || loading}
                  >
                    {appLoading ? "Applying..." : "Apply Changes"}
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

export default Settings;
