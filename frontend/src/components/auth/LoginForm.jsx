import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { login } from "@/store/slices/authSlice";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(() => true);
    dispatch(login({ email: formData.email, password: formData.password }))
      .unwrap()
      .then(() => navigate("/dashboard"))
      .finally(() => {
        setLoading(() => false);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="pl-10 h-12 focus:ring-primary focus:border-primary"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="pl-10 pr-10 h-12 focus:ring-primary focus:border-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full h-12" disabled={loading}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <ForgotPasswordDialog open={showForgotPassword} onOpenChange={setShowForgotPassword} />
    </>
  );
};

export default LoginForm;
