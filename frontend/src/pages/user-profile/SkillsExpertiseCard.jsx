import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SkillsExpertiseCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Skills & Expertise</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-slate-800 mb-2">Technical Skills</h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm">
              JavaScript
            </span>
            <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm">
              React
            </span>
            <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm">
              Node.js
            </span>
            <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm">
              TypeScript
            </span>
            <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm">
              GraphQL
            </span>
            <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm">
              AWS
            </span>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-slate-800 mb-2">Languages</h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm">
              English (Native)
            </span>
            <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm">
              Spanish (Intermediate)
            </span>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-slate-800 mb-2">Certifications</h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm">
              AWS Certified Developer
            </span>
            <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm">
              Scrum Master
            </span>
          </div>
        </div>
      </div>
      <Button className="mt-6">Update Skills</Button>
    </CardContent>
  </Card>
);

export default SkillsExpertiseCard;
