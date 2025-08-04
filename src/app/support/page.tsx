import { Metadata } from "next";
import Support from "@/views/support/Support.view";

export const metadata: Metadata = {
  title: "Support | FAP Scout",
  description: "Get help and support for your scouting needs. Contact our team for assistance.",
  keywords: ["support", "help", "contact", "assistance", "scout support"],
  openGraph: {
    title: "Support | FAP Scout",
    description: "Get help and support for your scouting needs. Contact our team for assistance.",
    type: "website",
  },
};

export default function SupportPage() {
  return <Support />;
}
