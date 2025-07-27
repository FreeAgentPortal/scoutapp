import { Metadata } from "next";
import WorkInProgress from "@/components/workInProgress/WorkInProgress.component";

export const metadata: Metadata = {
  title: "My Reports | FAP Scout",
  description: "View and manage your detailed scout reports and evaluations.",
  keywords: ["scout reports", "athlete evaluation", "performance analysis", "recruiting"],
  openGraph: {
    title: "My Reports | FAP Scout",
    description: "View and manage your detailed scout reports and evaluations.",
    type: "website",
  },
};

export default function ReportsPage() {
  return (
    <WorkInProgress
      title="Scout Reports"
      description="Your personalized reporting dashboard is being developed! Soon you'll be able to create, edit, and share detailed athlete evaluations."
      icon="📊"
    />
  );
}
