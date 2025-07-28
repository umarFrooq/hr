import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

const ForgotPasswordDialog = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      setEmail("");
      // You can add a toast notification here
    }, 2000);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-emerald-600" />
            Password Reset Request
          </DialogTitle>
          <DialogDescription className="text-left">
            Are you sure you want to send a password reset request to your HR department? They will
            be able to reset your password and provide you with new login credentials.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="text-gray-700 font-medium">
              Your Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !email}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? "Sending Request..." : "Send Request to HR"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
