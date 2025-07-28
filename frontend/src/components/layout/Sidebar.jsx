import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { LayoutDashboard, Calendar, User, Settings, Clock, Mail, X, Building2 } from "lucide-react";
import Logo from "@/assets/CodeTricksLogo.svg";
import { hasPermission } from "@/utils/permission";
import { useSelector } from "react-redux";
import { scope } from "@/utils/constant";

const NavItem = ({ to, icon: Icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
          isActive
            ? "bg-hr-primary text-white"
            : "text-slate-700 hover:bg-hr-light hover:text-hr-primary"
        }`
      }
      onClick={onClick}
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
};

const NavGroup = ({ title, children }) => {
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {title}
      </h3>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
};

export const Sidebar = ({ open, setOpen }) => {
  const permissions = useSelector((state) => state.auth?.permissions);
  const organizationLogo = useSelector((state) => state.auth?.user?.organizationData?.logo);

  const isMobile = useIsMobile();

  const closeSidebar = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  // let showOrgNav = !!(
  //   hasPermission(permissions, "organizations", "read", scope.ORGANIZATION) &&
  //   hasPermission(permissions, "organizations", "update", scope.ORGANIZATION)
  // );
  // let organizationEditPath = "/organizations";
  // let organizationLabel = "Organizations";

  // if (
  //   hasOrgRead &&
  //   hasOrgUpdate &&
  //   (user?.role === roles.ADMIN || user?.role === roles.CLIENT) &&
  //   !user?.organization?.id
  // ) {
  //   showOrgNav = true;
  //   organizationLabel = "Organization";
  //   organizationEditPath = "/organizations/add";
  // } else if (
  //   hasOrgRead &&
  //   hasOrgUpdate &&
  //   (user?.role === roles.ADMIN || user?.role === roles.CLIENT) &&
  //   user?.organization?.id
  // ) {
  //   showOrgNav = true;
  //   organizationEditPath = `/organizations/edit/${user.organization.id}`;
  //   organizationLabel = "Organization";
  // } else if (hasOrgCreate && hasOrgRead && hasOrgUpdate && hasOrgDelete) {
  //   showOrgNav = true;
  //   organizationEditPath = "/organizations";
  //   organizationLabel = "Organizations";
  // }
  // If only has read, do not show nav (showOrgNav remains false)

  const renderNavItems = () => {
    return (
      <>
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={closeSidebar} />
        {hasPermission(permissions, "users", "read", [scope.ORGANIZATION, scope.TEAM]) && (
          <NavItem to="/users" icon={User} label="Users" onClick={closeSidebar} />
        )}
        {hasPermission(permissions, "organizations", "read", [scope.ORGANIZATION, scope.TEAM]) && (
          <NavItem
            to="/organizations"
            icon={Building2}
            label="Organizations"
            onClick={closeSidebar}
          />
        )}
        {hasPermission(permissions, "checkin", "read", [
          scope.ORGANIZATION,
          scope.TEAM,
          scope.OWN,
        ]) && <NavItem to="/attendance" icon={Clock} label="Attendance" onClick={closeSidebar} />}
        {hasPermission(permissions, "leaves", "read", [
          scope.ORGANIZATION,
          scope.TEAM,
          scope.OWN,
        ]) && <NavItem to="/leaves" icon={Calendar} label="Leaves" onClick={closeSidebar} />}

        {hasPermission(permissions, "requests", "read", [
          scope.ORGANIZATION,
          scope.TEAM,
          scope.OWN,
        ]) && <NavItem to="/requests" icon={Mail} label="Requests" onClick={closeSidebar} />}
      </>
    );
  };

  // Mobile Sidebar
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-20 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 pb-0">
              <div className="flex justify-center items-center w-full px-2">
                <img src={organizationLogo ?? Logo} alt="Logo" className="h-auto max-h-12 w-auto" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X size={20} />
              </Button>
            </div>

            <nav className="p-4 flex-1 overflow-y-auto">
              <renderNavItems />
            </nav>

            {/* Fixed Settings at Bottom */}
            <div className="p-4 border-t">
              {hasPermission(permissions, "profile", "read", [scope.OWN]) && (
                <NavItem to="/settings" icon={Settings} label="Settings" onClick={closeSidebar} />
              )}
            </div>
          </div>
        </aside>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside className="w-72 border-r bg-white shadow-sm hidden md:block h-screen sticky top-0">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="flex items-center">
            <div className="flex justify-center items-center w-full px-2">
              <img src={organizationLogo ?? Logo} alt="Logo" className="h-auto max-h-20 w-auto" />
            </div>
          </div>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">{renderNavItems()}</nav>

        {/* Fixed Settings at Bottom */}
        <div className="p-4">
          {hasPermission(permissions, "settings", "read", [scope.OWN]) && (
            <NavItem to="/settings" icon={Settings} label="Settings" onClick={closeSidebar} />
          )}
        </div>
      </div>
    </aside>
  );
};
