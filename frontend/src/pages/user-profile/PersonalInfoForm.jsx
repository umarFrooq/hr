import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "@/hooks/use-toast";

const PersonalInfoForm = () => {
  const { profile, saveProfile, loading } = useUserProfile();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zip_code: profile.zip_code || "",
      });
    }
  }, [profile]);

  function onChange(e) {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await saveProfile(form);
    if (res.error) {
      const description =
        typeof res.error === "string"
          ? res.error
          : res.error && "message" in res.error && res.error.message
            ? res.error.message
            : "Unknown error";
      toast({
        title: "Failed to save profile",
        description,
        variant: "destructive",
      });
    } else {
      toast({ title: "Profile updated" });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={form.first_name}
                onChange={onChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={form.last_name}
                onChange={onChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={onChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" value={form.address} onChange={onChange} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={form.city} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" value={form.state} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input id="zip_code" value={form.zip_code} onChange={onChange} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
