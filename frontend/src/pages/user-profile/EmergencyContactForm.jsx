import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEmergencyContact } from "@/hooks/useEmergencyContact";
import { toast } from "@/hooks/use-toast";

const EmergencyContactForm = () => {
  const { contact, saveContact, loading } = useEmergencyContact();

  const [form, setForm] = useState({
    contact_name: "",
    relation: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (contact) {
      setForm({
        contact_name: contact.contact_name || "",
        relation: contact.relation || "",
        phone: contact.phone || "",
        email: contact.email || "",
      });
    }
  }, [contact]);

  function onChange(e) {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await saveContact(form);
    if (res.error) {
      const description =
        typeof res.error === "string"
          ? res.error
          : res.error && "message" in res.error && res.error.message
            ? res.error.message
            : "Unknown error";
      toast({
        title: "Failed to save emergency contact",
        description,
        variant: "destructive",
      });
    } else {
      toast({ title: "Emergency contact updated" });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_name">Contact Name</Label>
              <Input
                id="contact_name"
                value={form.contact_name}
                onChange={onChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relation">Relationship</Label>
              <Input id="relation" value={form.relation} onChange={onChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={onChange}
              />
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

export default EmergencyContactForm;
