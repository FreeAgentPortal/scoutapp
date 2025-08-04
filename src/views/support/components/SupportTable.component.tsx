"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/state/search";
import { useUser } from "@/state/auth";
import useApiHook from "@/hooks/useApi";
import Paginator from "@/components/pagination/Paginator.component";
import styles from "./SupportTable.module.scss";

interface SupportTableProps {
  onCreateTicket: () => void;
}

interface TicketData {
  _id: string;
  subject: string;
  status: "open" | "new" | "pending" | "solved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  groups?: Array<{ name: string }>;
  createdAt: string;
  updatedAt: string;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return { color: "red", text: "Open", tooltip: "Awaiting response from support" };
      case "new":
        return { color: "blue", text: "New", tooltip: "Has yet to be reviewed by support" };
      case "solved":
      case "closed":
        return { color: "gray", text: "Closed", tooltip: "This ticket has been resolved" };
      case "pending":
        return { color: "orange", text: "Pending", tooltip: "Awaiting response from user" };
      default:
        return { color: "red", text: "Open", tooltip: "Awaiting response from support" };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`${styles.statusBadge} ${styles[config.color]}`} title={config.tooltip}>
      {config.text}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "blue";
      case "low":
      default:
        return "gray";
    }
  };

  return <span className={`${styles.priorityBadge} ${styles[getPriorityColor(priority)]}`}>{priority || "Low"}</span>;
};

const SupportTable: React.FC<SupportTableProps> = ({ onCreateTicket }) => {
  const router = useRouter();
  const { data: user } = useUser();
  const { pageNumber, pageLimit, setPageNumber } = useSearchStore();

  // API hook for fetching tickets
  const { data, isLoading, isError, error } = useApiHook({
    method: "GET",
    url: `/support/ticket`,
    limit: pageLimit,
    key: ["tickets", pageNumber.toString()],
    enabled: !!user?._id,
    filter: `requester;${user?._id}`,
    staleTime: 1000 * 60 * 2, // 2 minutes
  }) as any;

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handleViewTicket = (ticketId: string) => {
    router.push(`/support/${ticketId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const tickets = data?.payload || [];
  const totalResults = data?.metadata?.totalCount || tickets.length;
  const totalPages = data?.metadata?.totalPages || Math.ceil(totalResults / pageLimit);

  if (isLoading) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading your support tickets...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.errorState}>
          <p>Unable to load support tickets</p>
          <p className={styles.errorDetails}>{error?.message}</p>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.emptyState}>
          <h3>No Support Tickets Yet</h3>
          <p>You haven&apos;t created any support tickets yet.</p>
          <button className={styles.createButton} onClick={onCreateTicket}>
            Create Your First Ticket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Group</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket: TicketData) => (
              <tr key={ticket._id} className={styles.tableRow}>
                <td className={styles.subjectCell}>
                  <span className={styles.subject}>{ticket.subject}</span>
                </td>
                <td>
                  <StatusBadge status={ticket.status} />
                </td>
                <td>
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className={styles.groupCell}>
                  {ticket.groups?.map((group) => group.name).join(", ") || "General"}
                </td>
                <td className={styles.dateCell}>{formatDate(ticket.createdAt)}</td>
                <td>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleViewTicket(ticket._id)}
                    title="View ticket details"
                  >
                    <span className={styles.actionIcon}>👁️</span>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Paginator currentPage={pageNumber} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default SupportTable;
