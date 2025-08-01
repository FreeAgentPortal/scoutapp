import { Metadata } from "next";
import WorkInProgress from "@/components/workInProgress/WorkInProgress.component";
import Reports from "@/views/report/Reports.view";

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
  return <Reports />;
}
