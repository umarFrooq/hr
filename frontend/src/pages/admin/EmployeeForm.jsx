import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

// Reusable modal form for Add/Edit Employee
const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "HR",
  "Finance",
  "Operations",
  "Sales",
  "Customer Support",
];
const STATUSES = ["Active", "On Leave", "Inactive"];

const EmployeeForm = ({ open, onClose, employee }) => {
  const isEdit = !!employee;
  const [form, setForm] = useState(
    employee || {
      id: "",
      name: "",
      email: "",
      department: "Engineering",
      position: "",
      join_date: "",
      status: "Active",
      user_id: null,
    },
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !form.id ||
      !form.name ||
      !form.email ||
      !form.position ||
      !form.join_date
    ) {
      toast({
        title: "Missing fields",
        description: "All fields are required.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isEdit) {
      toast({ title: "Employee updated!" });
    } else {
      toast({ title: "Employee + Auth user added!" });
    }

    setLoading(false);
    onClose(true);
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Employee" : "Add Employee"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1">Employee ID</label>
                <Input
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                  required
                  disabled={isEdit}
                />
              </div>
              <div>
                <label className="block mb-1">Name</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Department</label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-2"
                  required
                >
                  {DEPARTMENTS.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Position</label>
                <Input
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Join Date</label>
                <Input
                  name="join_date"
                  type="date"
                  value={form.join_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-2"
                  required
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-4 justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : isEdit ? "Update" : "Add"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onClose()}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeForm;
