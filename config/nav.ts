import {
  Database,
  FileText,
  HomeIcon,
  LayoutDashboard,
  Library,
  MessageSquare,
  SearchIcon,
  Users,
} from "lucide-react";

export const nav = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: HomeIcon,
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessageSquare,
    },
    {
      title: "Advanced Search",
      url: "/search",
      icon: SearchIcon,
    },
  ],
  navProfile: [
    {
      title: "My Library",
      url: "/my-library",
      icon: Library,
    },
  ],
};

export const navAdmin = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Documents",
      url: "/admin/documents",
      icon: FileText,
    },
  ],
  navSecondary: [
    {
      name: "Export Data",
      url: "/admin/exports",
      icon: Database,
    },
    {
      name: "Reports",
      url: "/admin/reports",
      icon: FileText,
    },
  ],
};
