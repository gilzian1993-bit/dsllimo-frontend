"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Loader2, User, Settings, Power } from "lucide-react";
import { useUser, useLogout } from "@/hooks/auth-query/use-auth";

const ProfileInfo = () => {
  const { data: user, isLoading } = useUser();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    logoutMutation.mutate();
  };

  const getUserInitials = () => {
    if (!user?.fullName) return "AU";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className=" cursor-pointer">
        <div className=" flex items-center ">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              getUserInitials()
            )}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0" align="end">
        <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              getUserInitials()
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-default-800 capitalize ">
              {isLoading ? "Loading..." : user?.fullName || "Admin User"}
            </div>
            <div className="text-xs text-default-600">
              {isLoading ? "..." : user?.email || "admin@example.com"}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mb-0 dark:bg-background" />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          disabled={logoutMutation.isPending}
          className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 dark:hover:bg-background cursor-pointer disabled:opacity-50"
        >
          {logoutMutation.isPending ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <Power className="w-4 h-4" />
              Log out
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileInfo;
