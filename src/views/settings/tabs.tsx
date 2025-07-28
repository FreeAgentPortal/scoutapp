import React from "react";
import UserProfile from "./subviews/accountSettings/UserProfile.tab";
import ScoutProfile from "./subviews/scoutSettings/ScoutProfile.tab";
import { TabItem } from "@/components/tabs";

const tabs: TabItem[] = [
  {
    id: "user",
    label: "User Profile",
    icon: "👤",
    component: <UserProfile />,
  },
  {
    id: "scout",
    label: "Scout Profile",
    icon: "🏈",
    component: <ScoutProfile />,
  },
] as TabItem[];

export default tabs;
