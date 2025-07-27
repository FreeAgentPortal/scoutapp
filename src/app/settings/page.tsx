import { Metadata } from "next";
import WorkInProgress from "@/components/workInProgress/WorkInProgress.component";

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
  return (
    <WorkInProgress
      title="Settings & Preferences"
      description="A comprehensive settings panel is in development! You'll be able to customize notifications, search preferences, and account details."
      icon="⚙️"
    />
  );
}
