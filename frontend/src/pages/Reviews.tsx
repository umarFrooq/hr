import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, MessageSquare, Shield, Star, ThumbsUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Reviews = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    category: "",
    subject: "",
    feedback: "",
    rating: "",
    recommendation: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your anonymous feedback. Your input helps us improve.",
      duration: 5000,
    });

    setSubmitted(true);

    // Reset form after a delay
    setTimeout(() => {
      setFormData({
        category: "",
        subject: "",
        feedback: "",
        rating: "",
        recommendation: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Anonymous Reviews</h1>
        <p className="text-slate-500 mt-1">Share your thoughts and suggestions anonymously</p>
      </div>

      <Tabs defaultValue="feedback">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feedback">Submit Feedback</TabsTrigger>
          <TabsTrigger value="about">About Anonymous Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-hr-primary" />
                  Anonymous Feedback Form
                </CardTitle>
                <CardDescription>
                  Your feedback is completely anonymous. We value your honest input.
                </CardDescription>
              </CardHeader>
              {submitted ? (
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-green-600">
                    Feedback Submitted Successfully
                  </h3>
                  <p className="text-slate-500 mt-2 max-w-md">
                    Thank you for sharing your thoughts. Your anonymous feedback helps us improve
                    our workplace.
                  </p>
                </CardContent>
              ) : (
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Feedback Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleSelectChange("category", value)}
                          required
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="workplace">Workplace Environment</SelectItem>
                            <SelectItem value="management">Management</SelectItem>
                            <SelectItem value="benefits">Compensation & Benefits</SelectItem>
                            <SelectItem value="policies">Company Policies</SelectItem>
                            <SelectItem value="culture">Company Culture</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rating">Overall Rating</Label>
                        <Select
                          value={formData.rating}
                          onValueChange={(value) => handleSelectChange("rating", value)}
                          required
                        >
                          <SelectTrigger id="rating">
                            <SelectValue placeholder="Rate your experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 - Excellent</SelectItem>
                            <SelectItem value="4">4 - Very Good</SelectItem>
                            <SelectItem value="3">3 - Satisfactory</SelectItem>
                            <SelectItem value="2">2 - Needs Improvement</SelectItem>
                            <SelectItem value="1">1 - Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Brief subject of your feedback"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feedback">Feedback Details</Label>
                      <Textarea
                        id="feedback"
                        name="feedback"
                        value={formData.feedback}
                        onChange={handleChange}
                        placeholder="Please provide specific details about your feedback or suggestion..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recommendation">Recommendations</Label>
                      <Textarea
                        id="recommendation"
                        name="recommendation"
                        value={formData.recommendation}
                        onChange={handleChange}
                        placeholder="What would you recommend to address this feedback?"
                        rows={3}
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 flex space-x-3">
                      <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Your privacy is protected</p>
                        <p className="mt-1">
                          All submissions are completely anonymous. No personal identifiers are
                          collected or stored with your feedback.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">Submit Anonymous Feedback</Button>
                    </div>
                  </form>
                </CardContent>
              )}
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Why Submit Feedback?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <ThumbsUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Drive Improvement</h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                          Your feedback helps us identify areas for improvement and make better
                          decisions.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Completely Anonymous</h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                          Your identity is never revealed or stored with your feedback.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <MessageSquare className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Open Communication</h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                          Encourages honest communication about issues that matter to you.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Improvements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border-l-2 border-green-500 pl-3 py-1">
                      <p className="font-medium">Flexible Work Policy</p>
                      <p className="text-xs text-slate-500">
                        Implemented based on anonymous feedback
                      </p>
                    </div>
                    <div className="border-l-2 border-green-500 pl-3 py-1">
                      <p className="font-medium">Mental Health Resources</p>
                      <p className="text-xs text-slate-500">Added to benefits package</p>
                    </div>
                    <div className="border-l-2 border-green-500 pl-3 py-1">
                      <p className="font-medium">New Collaboration Tools</p>
                      <p className="text-xs text-slate-500">Integrated based on team feedback</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>About Our Anonymous Feedback System</CardTitle>
              <CardDescription>
                How your privacy is protected and how we use your feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">How We Protect Your Anonymity</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    Our anonymous feedback system is designed with your privacy as the top priority:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>No personal identifiers are collected or stored with your submission</li>
                    <li>IP addresses and device information are not tracked or logged</li>
                    <li>Submissions are encrypted end-to-end</li>
                    <li>Access to anonymous feedback is restricted to authorized personnel only</li>
                    <li>Feedback is aggregated when shared with leadership teams</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">How We Use Your Feedback</h3>
                <div className="space-y-2 text-sm">
                  <p>Your honest feedback helps us improve our workplace in several ways:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Identifying trends and patterns in employee satisfaction</li>
                    <li>Addressing potential issues before they become problems</li>
                    <li>Making informed decisions about policies and benefits</li>
                    <li>Creating a more inclusive and supportive work environment</li>
                    <li>Measuring the impact of changes and initiatives over time</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Our Commitment to Action</h3>
                <div className="space-y-2 text-sm">
                  <p>We're committed to not just collecting feedback, but acting on it:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Leadership reviews anonymous feedback on a regular basis</li>
                    <li>Actions taken based on feedback are communicated company-wide</li>
                    <li>We track our response rate to ensure all feedback is considered</li>
                    <li>Regular reporting on improvements made from anonymous suggestions</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                <h3 className="text-amber-800 font-medium">Important Note</h3>
                <p className="text-sm text-amber-700 mt-1">
                  While our system is designed to protect your anonymity, please avoid including
                  specific personal details in your feedback that might inadvertently identify you.
                  For urgent or personal matters that require immediate attention, please use
                  appropriate HR channels.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reviews;
