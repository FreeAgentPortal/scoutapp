import { Metadata } from "next";
import WorkInProgress from "@/components/workInProgress/WorkInProgress.component";
import Search from "@/views/search/Search.view";

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
  return <Search />;
}
