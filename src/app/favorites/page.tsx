import { Metadata } from "next";
import WorkInProgress from "@/components/workInProgress/WorkInProgress.component";
import Favorites from "@/views/favorites/Favorites.view";

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
  return <Favorites />;
}
