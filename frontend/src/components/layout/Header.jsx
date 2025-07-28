import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, CircleUserRound, EllipsisVertical, LogOut, Menu } from "lucide-react";
import { logout } from "@/store/slices/authSlice"; // Adjust the import path if needed
import { baseApi } from "@/store/api/baseApi";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Header = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Adjust the import path if needed
  const { user } = useSelector((state) => state.auth); // Adjust the import path if needed

  const handleLogout = () => {
    dispatch(baseApi.util.resetApiState());
    localStorage.clear();
    localStorage.setItem("isSynced", "true");
    dispatch(logout());
    navigate("/login"); // Adjust the import path if needed
  };

  return (
    <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden mr-2">
          <Menu size={20} />
        </Button>
        <h1 className="text-lg font-semibold text-slate-800">
          {user?.organizationData?.name ?? "Code Trick Solutions"}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarFallback className="rounded-lg">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.firstName}</span>
                <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-lg">
                  {/* <AvatarImage src={user.avatar} alt={user.firstName} /> */}
                  <AvatarFallback className="rounded-lg">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.firstName}</span>
                  <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
                <CircleUserRound className="h-4 w-4 mr-2" />
                My Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
