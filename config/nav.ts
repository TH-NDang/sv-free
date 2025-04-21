import {
  BarChart3,
  Database,
  FileText,
  HomeIcon,
  Library,
  SearchIcon,
  Users,
  LayoutDashboard,
} from "lucide-react";

export const nav = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: HomeIcon,
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
      url: "/admin",
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
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
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
