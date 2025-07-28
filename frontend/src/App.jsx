import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
// import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Unauthorized from "@/pages/Unauthorized";
import Dashboard from "@/pages/Dashboard";
import UserProfile from "@/pages/UserProfile";
import Attendance from "@/pages/Attendance";
import SalarySlips from "@/pages/SalarySlips";
import LeaveManagement from "@/pages/LeaveManagement";
import Performance from "@/pages/Performance";
import Documents from "@/pages/Documents";
import Requests from "@/pages/Requests";
import Announcements from "@/pages/Announcements";
import WifiCredentials from "@/pages/WifiCredentials";
import Settings from "@/pages/Settings";
import Recommendations from "@/pages/Recommendations";
import InterviewScheduler from "@/pages/admin/InterviewScheduler";
import NotFound from "@/pages/NotFound";
import Career from "@/pages/Career";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/index";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ThemeProvider } from "next-themes";
import Users from "@/pages/users";
import UserForm from "@/pages/users/UserForm";
import AuthRoute from "@/components/auth/AuthRoute";
import Organizations from "@/pages/Organizations";
import OrganizationForm from "@/pages/OrganizationForm";
import { scope } from "@/utils/constant";

const queryClient = new QueryClient();

function App() {
  if (!localStorage.getItem("isSynced")) {
    localStorage.clear();
    localStorage.setItem("isSynced", "true");
    window.location.reload();
  }
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Provider store={store}>
        <PersistGate
          loading={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          }
          persistor={persistor}
        >
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster position="top-right" />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route
                    element={
                      <AuthRoute>
                        <AppLayout />
                      </AuthRoute>
                    }
                  >
                    <Route index element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                      path="/users"
                      element={
                        <ProtectedRoute
                          resource="users"
                          action="read"
                          scope={[scope.ORGANIZATION, scope.TEAM]}
                        >
                          <Users />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/users/add"
                      element={
                        <ProtectedRoute
                          resource="users"
                          action="create"
                          scope={[scope.ORGANIZATION, scope.TEAM]}
                        >
                          <UserForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/users/edit/:id"
                      element={
                        <ProtectedRoute
                          resource="users"
                          action="update"
                          scope={[scope.ORGANIZATION, scope.TEAM]}
                        >
                          <UserForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/organizations"
                      element={
                        <ProtectedRoute
                          resource="organizations"
                          action="read"
                          scope={[scope.ORGANIZATION, scope.TEAM]}
                        >
                          <Organizations />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/organizations/add"
                      element={
                        <ProtectedRoute
                          resource="organizations"
                          action="create"
                          scope={[scope.ORGANIZATION, scope.TEAM]}
                        >
                          <OrganizationForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/organizations/edit/:id"
                      element={
                        <ProtectedRoute
                          resource="organizations"
                          action="update"
                          scope={[scope.ORGANIZATION, scope.TEAM]}
                        >
                          <OrganizationForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute resource="profile" action="read" scope={[scope.OWN]}>
                          <UserProfile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/attendance"
                      element={
                        <ProtectedRoute
                          resource="checkin"
                          action="read"
                          scope={[scope.ORGANIZATION, scope.TEAM, scope.OWN]}
                        >
                          <Attendance />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/leaves"
                      element={
                        <ProtectedRoute
                          resource="leaves"
                          action="read"
                          scope={[scope.ORGANIZATION, scope.TEAM, scope.OWN]}
                        >
                          <LeaveManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/salary"
                      element={
                        <ProtectedRoute
                          resource="salary"
                          action="read"
                          scope={[scope.ORGANIZATION, scope.TEAM]}
                        >
                          <SalarySlips />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/performance"
                      element={
                        <ProtectedRoute
                          resource="performance"
                          action="read"
                          scope={[scope.ORGANIZATION, scope.TEAM]}
                        >
                          <Performance />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/documents"
                      element={
                        <ProtectedRoute
                          resource="documents"
                          action="read"
                          scope={[scope.ORGANIZATION, scope.TEAM]}
                        >
                          <Documents />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/requests"
                      element={
                        <ProtectedRoute
                          resource="requests"
                          action="read"
                          scope={[scope.ORGANIZATION, scope.TEAM, scope.OWN]}
                        >
                          <Requests />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/announcements"
                      element={
                        <ProtectedRoute
                          resource="announcements"
                          action="read"
                          scope={[scope.ORGANIZATION, scope.TEAM, scope.OWN]}
                        >
                          <Announcements />
                        </ProtectedRoute>
                      }
                    />
                    {/* <Route
                      path="/wifi"
                      element={
                        <ProtectedRoute resource="wifi" action="read">
                          <WifiCredentials />
                        </ProtectedRoute>
                      }
                    /> */}
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute resource="settings" action="read" scope={[scope.OWN]}>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                    {/* <Route
                      path="/recommendations"
                      element={
                        <ProtectedRoute resource="recommendations" action="read">
                          <Recommendations />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/interviews"
                      element={
                        <ProtectedRoute resource="interviews" action="read">
                          <InterviewScheduler />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/career"
                      element={
                        <ProtectedRoute resource="career" action="read">
                          <Career />
                        </ProtectedRoute>
                      }
                    /> */}
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
