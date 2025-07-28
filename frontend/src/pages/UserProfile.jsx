import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSidebarCard from "./user-profile/UserSidebarCard";
import PersonalInfoForm from "./user-profile/PersonalInfoForm";
import EmergencyContactForm from "./user-profile/EmergencyContactForm";
import WorkInfoCard from "./user-profile/WorkInfoCard";
import SkillsExpertiseCard from "./user-profile/SkillsExpertiseCard";
import PreferencesForm from "./user-profile/PreferencesForm";
import DangerZoneCard from "./user-profile/DangerZoneCard";

const UserProfile = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 mt-1">View and update your information</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <UserSidebarCard />
        </div>
        <div className="lg:col-span-3">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-3 max-w-[400px] mb-6">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="work">Work</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="space-y-6">
              <PersonalInfoForm />
              <EmergencyContactForm />
            </TabsContent>
            <TabsContent value="work" className="space-y-6">
              <WorkInfoCard />
              <SkillsExpertiseCard />
            </TabsContent>
            <TabsContent value="settings" className="space-y-6">
              <PreferencesForm />
              <DangerZoneCard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
