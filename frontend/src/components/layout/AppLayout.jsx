import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

export const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  try {
    return (
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
            <div className="max-w-8xl mx-auto">
              <Outlet />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    );
  } catch (error) {
    return <div>Error loading layout</div>;
  }
};
