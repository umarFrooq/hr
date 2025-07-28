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
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Users, Star } from "lucide-react";

const Recommendations = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Hiring Recommendations
        </h1>
        <p className="text-slate-500 mt-1">
          Recommend potential candidates for open positions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Submit a Recommendation</CardTitle>
            <CardDescription>
              Help us find great talent by recommending someone you know
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="candidate-name"
                    className="text-sm font-medium"
                  >
                    Candidate Name
                  </label>
                  <Input
                    id="candidate-name"
                    placeholder="Enter candidate's full name"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="candidate-email"
                    className="text-sm font-medium"
                  >
                    Candidate Email
                  </label>
                  <Input
                    id="candidate-email"
                    placeholder="Enter candidate's email"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-medium">
                    Position Recommended For
                  </label>
                  <Input id="position" placeholder="Select or enter position" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="relationship" className="text-sm font-medium">
                    Your Relationship
                  </label>
                  <Input
                    id="relationship"
                    placeholder="Ex: Former colleague, Friend, etc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="skills" className="text-sm font-medium">
                  Skills & Experience
                </label>
                <Textarea
                  id="skills"
                  placeholder="What makes this candidate a good fit for the position?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="additional" className="text-sm font-medium">
                  Additional Information
                </label>
                <Textarea
                  id="additional"
                  placeholder="Any additional information that might help us consider this candidate"
                  rows={2}
                />
              </div>

              <div className="flex justify-end">
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Submit Recommendation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-amber-400" />
                Referral Program
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Employees who refer successful candidates may be eligible for
                our referral bonus program.
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li>$500 bonus for entry-level positions</li>
                <li>$1,000 bonus for mid-level positions</li>
                <li>$2,000 bonus for senior positions</li>
              </ul>
              <p className="text-sm text-slate-600">
                Bonus is paid after the referred employee completes 90 days.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Users className="h-5 w-5 mr-2" />
                Current Open Positions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                <li className="px-4 py-3">
                  <div className="font-medium">Frontend Developer</div>
                  <div className="text-sm text-slate-500">
                    Engineering • Full-time
                  </div>
                </li>
                <li className="px-4 py-3">
                  <div className="font-medium">Product Manager</div>
                  <div className="text-sm text-slate-500">
                    Product • Full-time
                  </div>
                </li>
                <li className="px-4 py-3">
                  <div className="font-medium">UX Designer</div>
                  <div className="text-sm text-slate-500">
                    Design • Full-time
                  </div>
                </li>
                <li className="px-4 py-3">
                  <div className="font-medium">Backend Developer</div>
                  <div className="text-sm text-slate-500">
                    Engineering • Full-time
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
