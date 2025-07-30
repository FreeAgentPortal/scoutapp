import { Metadata } from "next";
import WorkInProgress from "@/components/workInProgress/WorkInProgress.component";
import Athlete from "@/views/athlete/Athlete.view";

export const metadata: Metadata = {
  title: "Athlete Details | FAP Scout",
  description: "Your personalized athlete details view is coming soon! Easily access and manage athlete information.",
  keywords: ["favorite athletes", "saved prospects", "bookmarks", "recruiting list"],
  openGraph: {
    title: "Athlete Details | FAP Scout",
    description: "Your personalized athlete details view is coming soon! Easily access and manage athlete information.",
    type: "website",
  },
};

export default function AthleteDetailsPage() {
  return <Athlete />;
}
