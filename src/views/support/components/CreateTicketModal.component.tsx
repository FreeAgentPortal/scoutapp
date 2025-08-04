"use client";

import React, { useState } from "react";
import useApiHook from "@/hooks/useApi";
import { ISupportGroup } from "@/types/ISupport";
import styles from "./CreateTicketModal.module.scss";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticketData: any) => void;
  isLoading: boolean;
}

interface FormErrors {
  subject?: string;
  category?: string;
  message?: string;
}

interface FormData {
  subject: string;
  priority: "low" | "medium" | "high" | "urgent";
  category: string[];
  message: string;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    subject: "",
    priority: "medium",
    category: [],
    message: "",
  });

  // API hook for fetching support groups
  const { data: supportGroupsData } = useApiHook({
    method: "GET",
    url: `/support/support_group`,
    key: ["support_groups"],
    enabled: isOpen, // Only fetch when modal is open
    staleTime: 1000 * 60 * 10, // 10 minutes
  }) as any;

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.category || formData.category.length === 0) {
      newErrors.category = "Please select at least one category";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing (only for fields that have errors)
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        subject: "",
        priority: "medium",
        category: [],
        message: "",
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalOverlay} onClick={handleClose} />
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>Create Support Ticket</h2>
            <button className={styles.closeButton} onClick={handleClose} disabled={isLoading}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.label}>
                Subject *
              </label>
              <input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className={`${styles.input} ${errors.subject ? styles.error : ""}`}
                placeholder="Brief description of your issue"
                disabled={isLoading}
              />
              {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="priority" className={styles.label}>
                  Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => handleInputChange("priority", e.target.value)}
                  className={styles.select}
                  disabled={isLoading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>
                  Category *
                </label>
                <div className={styles.multiSelectContainer}>
                  <select
                    multiple
                    id="category"
                    value={formData.category}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
                      handleInputChange("category", selectedOptions);
                    }}
                    className={`${styles.multiSelect} ${errors.category ? styles.error : ""}`}
                    disabled={isLoading}
                    size={Math.min(5, supportGroupsData?.payload?.length || 3)}
                  >
                    {supportGroupsData?.payload?.map((group: ISupportGroup) => (
                      <option key={group._id} value={group.name}>
                        {group.name}
                      </option>
                    )) || (
                      <>
                        <option value="General Support">General Support</option>
                        <option value="Technical Issue">Technical Issue</option>
                        <option value="Account Management">Account Management</option>
                      </>
                    )}
                  </select>
                  <small className={styles.helpText}>Hold Ctrl/Cmd to select multiple categories</small>
                </div>
                {errors.category && <span className={styles.errorText}>{errors.category}</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>
                Message *
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className={`${styles.textarea} ${errors.message ? styles.error : ""}`}
                placeholder="Please describe your issue in detail..."
                rows={6}
                disabled={isLoading}
              />
              {errors.message && <span className={styles.errorText}>{errors.message}</span>}
            </div>

            <div className={styles.modalFooter}>
              <button type="button" onClick={handleClose} className={styles.cancelButton} disabled={isLoading}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTicketModal;
