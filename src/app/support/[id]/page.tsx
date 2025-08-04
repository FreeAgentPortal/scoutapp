import { Metadata } from "next";
import TicketDetail from "@/views/support/TicketDetail.view";

export const metadata: Metadata = {
  title: "Support Ticket | FAP Scout",
  description: "View and manage your support ticket details",
  keywords: ["support ticket", "help", "assistance", "ticket details"],
  openGraph: {
    title: "Support Ticket | FAP Scout",
    description: "View and manage your support ticket details",
    type: "website",
  },
};

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  return <TicketDetail ticketId={params.id} />;
}
