"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useApiHook from "@/hooks/useApi";
import { useUser } from "@/state/auth";
import { useInterfaceStore } from "@/state/interface";
import styles from "./TicketDetail.module.scss";
import { ISupportMessage } from "@/types/ISupportMessage";
import parser from "html-react-parser";
import TinyEditor, { TinyEditorRef } from "@/components/tinyEditor/TinyEditor.component";

interface TicketDetailProps {
  ticketId: string;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId }) => {
  const router = useRouter();
  const { data: user } = useUser();
  const { addAlert } = useInterfaceStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<TinyEditorRef>(null);

  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch ticket details
  const {
    data: ticketData,
    isLoading: ticketLoading,
    isError: ticketError,
  } = useApiHook({
    method: "GET",
    url: `/support/ticket/${ticketId}`,
    key: ["ticket", ticketId],
    enabled: !!ticketId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  }) as any;

  // Fetch ticket messages/conversation
  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useApiHook({
    method: "GET",
    url: `/support/ticket/${ticketId}/message`,
    key: ["ticket-messages", ticketId],
    enabled: !!ticketId,
    staleTime: 1000 * 30, // 30 seconds
  }) as any;

  // Send new message mutation
  const sendMessageMutation = useApiHook({
    method: "POST",
    url: `/support/ticket/${ticketId}/message`,
    key: ["send-message"],
    onSuccessCallback: () => {
      setNewMessage("");
      editorRef.current?.clearContent();
      setIsSubmitting(false);
      refetchMessages();
      addAlert({ message: "Message sent successfully", type: "success" });
    },
    onErrorCallback: (error: any) => {
      setIsSubmitting(false);
      addAlert({
        message: error?.response?.data?.message || "Failed to send message",
        type: "error",
      });
    },
  }) as any;

  // Update ticket status mutation
  const updateStatusMutation = useApiHook({
    method: "PUT",
    url: `/support/ticket/${ticketId}/status`,
    key: ["update-status"],
    onSuccessCallback: () => {
      refetchMessages();
      addAlert({ message: "Ticket status updated", type: "success" });
    },
    onErrorCallback: (error: any) => {
      addAlert({
        message: error?.response?.data?.message || "Failed to update status",
        type: "error",
      });
    },
  }) as any;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messagesData?.payload]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a temporary div to extract text content from HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = newMessage;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    if (!textContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    sendMessageMutation.mutate({
      formData: {
        message: newMessage,
        sender: user?._id,
      },
    });
  };

  const handleEditorChange = (content: string) => {
    setNewMessage(content);
  };

  // Helper function to check if HTML content has actual text
  const hasTextContent = (htmlContent: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    return textContent.trim().length > 0;
  };

  const handleStatusUpdate = (newStatus: string) => {
    updateStatusMutation.mutate({
      formData: { status: newStatus },
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return styles.statusOpen;
      case "in_progress":
      case "pending":
        return styles.statusInProgress;
      case "solved":
      case "closed":
        return styles.statusClosed;
      default:
        return styles.statusDefault;
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "low":
        return styles.priorityLow;
      case "medium":
        return styles.priorityMedium;
      case "high":
        return styles.priorityHigh;
      case "urgent":
        return styles.priorityUrgent;
      default:
        return styles.priorityDefault;
    }
  };

  if (ticketLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (ticketError || !ticketData?.payload) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h2>Ticket Not Found</h2>
          <p>The requested support ticket could not be found.</p>
          <button onClick={() => router.push("/support")} className={styles.backButton}>
            ← Back to Support
          </button>
        </div>
      </div>
    );
  }

  const ticket = ticketData.payload;
  const messages = messagesData?.payload || [];

  // Reverse messages to show newest at bottom (backend sends oldest first)
  const sortedMessages = [...messages].reverse();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => router.push("/support")} className={styles.backButton}>
          ← Back to Support
        </button>
        <div className={styles.ticketInfo}>
          <h1>Ticket #{ticket._id.slice(-8)}</h1>
          <div className={styles.badges}>
            <span className={`${styles.badge} ${getStatusBadgeClass(ticket.status)}`}>
              {ticket.status.replace("_", " ").toUpperCase()}
            </span>
            <span className={`${styles.badge} ${getPriorityBadgeClass(ticket.priority)}`}>
              {ticket.priority.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Status Update Actions */}
        {ticket.status !== "closed" && (
          <div className={styles.actions}>
            {ticket.status === "open" && (
              <button onClick={() => handleStatusUpdate("in_progress")} className={styles.actionButton}>
                Mark In Progress
              </button>
            )}
            {ticket.status === "in_progress" && (
              <button onClick={() => handleStatusUpdate("resolved")} className={styles.actionButton}>
                Mark Resolved
              </button>
            )}
            {ticket.status === "resolved" && (
              <button onClick={() => handleStatusUpdate("closed")} className={styles.actionButton}>
                Close Ticket
              </button>
            )}
          </div>
        )}
      </div>

      {/* Ticket Summary */}
      <div className={styles.ticketSummary}>
        <h2>{ticket.subject}</h2>
        <div className={styles.metadata}>
          <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
          <span>Category: {ticket.category?.join(", ") || "General"}</span>
          <span>Requester: {ticket.requester?.name || "Unknown"}</span>
        </div>
        <div className={styles.description}>
          <h3>Original Request</h3>
          <p>{ticket.description}</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className={styles.messagesContainer}>
        <div className={styles.messagesHeader}>
          <h3>Conversation</h3>
          {messagesLoading && <div className={styles.refreshSpinner} />}
        </div>

        <div className={styles.messagesList}>
          {sortedMessages.length === 0 ? (
            <div className={styles.noMessages}>
              <p>No messages yet. Start the conversation below.</p>
            </div>
          ) : (
            sortedMessages.map((message: ISupportMessage) => (
              <div
                key={message._id}
                className={`${styles.message} ${
                  message.sender._id === user?._id ? styles.ownMessage : styles.otherMessage
                }`}
              >
                <div className={styles.messageHeader}>
                  <span className={styles.senderName}>
                    {message.sender.fullName}
                    {message.sender.role === "support" && <span className={styles.supportBadge}>Support</span>}
                  </span>
                  <span className={styles.timestamp}>{formatTimestamp(message.createdAt)}</span>
                </div>
                <div className={styles.messageContent}>{parser(parser(message.message) as string)}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {ticket.status !== "closed" && (
          <form onSubmit={handleSendMessage} className={styles.messageForm}>
            <div className={styles.inputContainer}>
              <div className={styles.editorWrapper}>
                <TinyEditor ref={editorRef} handleChange={handleEditorChange} value={newMessage} />
              </div>
              <button
                type="submit"
                className={styles.sendButton}
                disabled={!hasTextContent(newMessage) || isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        )}

        {ticket.status === "closed" && (
          <div className={styles.closedNotice}>
            <p>This ticket has been closed. No further messages can be sent.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
