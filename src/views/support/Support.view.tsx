"use client";

import React, { useState } from "react";
import { useInterfaceStore } from "@/state/interface";
import useApiHook from "@/hooks/useApi";
import SupportStats from "./components/SupportStats.component";
import SupportTable from "./components/SupportTable.component";
import CreateTicketModal from "./components/CreateTicketModal.component";
import styles from "./Support.module.scss";

const Support: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { addAlert } = useInterfaceStore((state) => state);

  // API hook for creating tickets
  const { mutate: createTicket, isLoading: isCreating } = useApiHook({
    method: "POST",
    key: ["createTicket"],
    queriesToInvalidate: ["tickets", "ticketStats"],
  }) as any;

  const handleCreateTicket = (ticketData: any) => {
    createTicket(
      {
        url: `/support/ticket`,
        formData: ticketData,
      },
      {
        onSuccess: () => {
          addAlert({
            type: "success",
            message: "Support ticket created successfully",
          });
          setIsCreateModalOpen(false);
        },
        onError: (error: any) => {
          addAlert({
            type: "error",
            message: "Failed to create support ticket",
          });
        },
      }
    );
  };

  return (
    <div className={styles.supportContainer}>
      {/* Header Section */}
      <header className={styles.supportHeader}>
        <h1 className={styles.title}>Support Center</h1>
        <p className={styles.subtitle}>Manage your support tickets and get help when you need it</p>
      </header>

      {/* Support Interface */}
      <section className={styles.supportInterface}>
        {/* Stats Cards */}
        <div className={styles.statsContainer}>
          <SupportStats />
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.contentHeader}>
            <h2>Your Support Tickets</h2>
            <button className={styles.createButton} onClick={() => setIsCreateModalOpen(true)}>
              + Create New Ticket
            </button>
          </div>

          <SupportTable onCreateTicket={() => setIsCreateModalOpen(true)} />
        </div>
      </section>

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <CreateTicketModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTicket}
          isLoading={isCreating}
        />
      )}
    </div>
  );
};

export default Support;
