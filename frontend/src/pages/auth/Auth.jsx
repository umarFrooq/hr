import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, User, Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });

      // Reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hr-primary/10 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">HR Management System</h1>
          <p className="text-slate-600">Welcome to your employee portal</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-8"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-8 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="text-center">
                    <button type="button" className="text-sm text-hr-primary hover:underline">
                      Forgot your password?
                    </button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstname">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                          id="signup-firstname"
                          type="text"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="pl-8"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-lastname">Last Name</Label>
                      <Input
                        id="signup-lastname"
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-8"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-8 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-8"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>

                  <p className="text-xs text-center text-slate-500">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
