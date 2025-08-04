"use client";

import React from "react";
import useApiHook from "@/hooks/useApi";
import { useUser } from "@/state/auth";
import styles from "./SupportStats.module.scss";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: "primary" | "success" | "warning" | "info";
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, isLoading }) => {
  return (
    <div className={`${styles.statCard} ${styles[color]}`}>
      <div className={styles.cardContent}>
        <div className={styles.cardIcon}>
          <span className={styles.icon}>{icon}</span>
        </div>
        <div className={styles.cardText}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardValue}>{isLoading ? "..." : value}</p>
        </div>
      </div>
    </div>
  );
};

const SupportStats: React.FC = () => {
  const { data: user } = useUser();

  const userId = user?._id;
  const baseFilter = `requester;${userId}`;

  // API hook for total tickets (all tickets for this user)
  const { data: totalTicketsData, isLoading: totalLoading } = useApiHook({
    method: "GET",
    url: `/support/ticket`,
    key: ["ticketStats", "total"],
    enabled: !!userId,
    filter: baseFilter,
    staleTime: 1000 * 60 * 5, // 5 minutes
  }) as any;

  // API hook for open tickets
  const { data: openTicketsData, isLoading: openLoading } = useApiHook({
    method: "GET",
    url: `/support/ticket`,
    key: ["ticketStats", "open"],
    enabled: !!userId,
    filter: `${baseFilter}|status;open`,
    staleTime: 1000 * 60 * 5, // 5 minutes
  }) as any;

  // API hook for solved tickets
  const { data: solvedTicketsData, isLoading: solvedLoading } = useApiHook({
    method: "GET",
    url: `/support/ticket`,
    key: ["ticketStats", "solved"],
    enabled: !!userId,
    filter: `${baseFilter}|status;solved`,
    staleTime: 1000 * 60 * 5, // 5 minutes
  }) as any;

  const totalTickets = totalTicketsData?.metadata?.totalCount || totalTicketsData?.payload?.length || 0;
  const openTickets = openTicketsData?.metadata?.totalCount || openTicketsData?.payload?.length || 0;
  const solvedTickets = solvedTicketsData?.metadata?.totalCount || solvedTicketsData?.payload?.length || 0;

  return (
    <div className={styles.statsContainer}>
      <StatCard title="Total Tickets" value={totalTickets} icon="🎫" color="primary" isLoading={totalLoading} />
      <StatCard title="Open Tickets" value={openTickets} icon="🔓" color="warning" isLoading={openLoading} />
      <StatCard title="Solved Tickets" value={solvedTickets} icon="✅" color="success" isLoading={solvedLoading} />
    </div>
  );
};

export default SupportStats;
