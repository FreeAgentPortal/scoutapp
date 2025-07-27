import { Metadata } from "next";
import WorkInProgress from "@/components/workInProgress/WorkInProgress.component";

export const metadata: Metadata = {
  title: "Favorites | FAP Scout",
  description: "Quick access to your starred athletes and saved prospects.",
  keywords: ["favorite athletes", "saved prospects", "bookmarks", "recruiting list"],
  openGraph: {
    title: "Favorites | FAP Scout",
    description: "Quick access to your starred athletes and saved prospects.",
    type: "website",
  },
};

export default function FavoritesPage() {
  return (
    <WorkInProgress
      title="Favorite Athletes"
      description="Your personalized favorites collection is coming soon! Easily save and organize athletes you're most interested in tracking."
      icon="⭐"
    />
  );
}
