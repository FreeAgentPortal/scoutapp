import React from "react";

export interface ActionCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  route: string;
}

export const actionCardsData: ActionCard[] = [
  {
    id: "search",
    icon: "🔍",
    title: "Search Athletes",
    description: "Find and browse through our database of athletes",
    buttonText: "Start Search",
    route: "/search",
  },
  {
    id: "reports",
    icon: "📊",
    title: "My Reports",
    description: "View and manage your scout reports",
    buttonText: "View Reports",
    route: "/reports",
  },
  {
    id: "favorites",
    icon: "⭐",
    title: "Favorites",
    description: "Quick access to your starred athletes",
    buttonText: "View Favorites",
    route: "/favorites",
  },
  {
    id: "settings",
    icon: "⚙️",
    title: "Settings",
    description: "Customize your scouting preferences",
    buttonText: "Open Settings",
    route: "/settings",
  },
];
