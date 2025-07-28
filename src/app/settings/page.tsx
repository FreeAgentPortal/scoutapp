import { Metadata } from "next";
import WorkInProgress from "@/components/workInProgress/WorkInProgress.component";
import Settings from "@/views/settings/Settings.view";

export const metadata: Metadata = {
  title: "Settings | FAP Scout",
  description: "Customize your scouting preferences and account settings.",
  keywords: ["settings", "preferences", "account", "configuration", "profile"],
  openGraph: {
    title: "Settings | FAP Scout",
    description: "Customize your scouting preferences and account settings.",
    type: "website",
  },
};

export default function SettingsPage() {
  return <Settings />;
}
