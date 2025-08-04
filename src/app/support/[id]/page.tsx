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

export default async function TicketDetailPage({ params }:{ params:  Promise<{ id: string }> }) {
  const { id } = await params;
  return <TicketDetail ticketId={id} />;
}
