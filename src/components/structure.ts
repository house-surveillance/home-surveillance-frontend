import { logout } from "../api/auth";

const sidebarStructure = [
  {
    id: "Camera video",
    title: "camera video",
    name: "Camera video",
    parent: true,
    icon: "video-camera",
    link: "/",
  },
  {
    id: "Users",
    title: "Users management",
    name: "Users",
    parent: true,
    icon: "users",
    link: "/users",
  },
  {
    id: "Notifications",
    title: "Notifications",
    name: "Notifications",
    parent: true,
    icon: "notifications",
    link: "/notifications",
  },
  {
    id: "Logout",
    title: "Logout",
    name: "Logout",
    parent: false,
    icon: "logout",
    link: "/logout",
    action: logout,
  },
];

export { sidebarStructure };
