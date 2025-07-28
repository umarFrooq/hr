import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const PreferencesForm = () => (
  <Card>
    <CardHeader>
      <CardTitle>Preferences</CardTitle>
    </CardHeader>
    <CardContent>
      <form className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-slate-500">
                Receive emails about your account activity
              </p>
            </div>
            <div className="flex items-center h-5">
              <input
                id="email-notifications"
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 rounded border-slate-300 text-hr-primary focus:ring-hr-primary"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">SMS Notifications</Label>
              <p className="text-sm text-slate-500">
                Receive text messages for important updates
              </p>
            </div>
            <div className="flex items-center h-5">
              <input
                id="sms-notifications"
                type="checkbox"
                defaultChecked={false}
                className="h-4 w-4 rounded border-slate-300 text-hr-primary focus:ring-hr-primary"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Marketing Communications</Label>
              <p className="text-sm text-slate-500">
                Receive emails about new features and updates
              </p>
            </div>
            <div className="flex items-center h-5">
              <input
                id="marketing-emails"
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 rounded border-slate-300 text-hr-primary focus:ring-hr-primary"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button>Save Preferences</Button>
        </div>
      </form>
    </CardContent>
  </Card>
);

export default PreferencesForm;
