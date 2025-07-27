import { Metadata } from "next";
import WorkInProgress from "@/components/workInProgress/WorkInProgress.component";

export const metadata: Metadata = {
  title: "Search Athletes | FAP Scout",
  description: "Search and discover talented athletes in our comprehensive database.",
  keywords: ["athlete search", "sports recruitment", "talent discovery", "scout"],
  openGraph: {
    title: "Search Athletes | FAP Scout",
    description: "Search and discover talented athletes in our comprehensive database.",
    type: "website",
  },
};

export default function SearchPage() {
  return (
    <WorkInProgress
      title="Athlete Search"
      description="Our advanced athlete search and discovery system is coming soon! You'll be able to filter by sport, position, location, and performance metrics."
      icon="🔍"
    />
  );
}
