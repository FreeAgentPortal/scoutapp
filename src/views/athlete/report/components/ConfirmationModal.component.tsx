"use client";

import React from "react";
import styles from "./ConfirmationModal.module.scss";
import DiamondRating from "@/components/diamondRating";
import { IScoutReport } from "@/types/IScoutReport";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  athleteName: string;
  formData: Partial<IScoutReport>;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  athleteName,
  formData,
  isSubmitting = false,
  isEdit = false,
}) => {
  if (!isOpen) return null;

  // Calculate average rating from all scores
  const calculateAverageRating = (): number => {
    if (!formData.ratingBreakdown) return 0;

    const scores = Object.values(formData.ratingBreakdown).map((rating) => rating.score);
    if (scores.length === 0) return 0;

    const total = scores.reduce((sum, score) => sum + score, 0);
    return Math.round((total / scores.length) * 10) / 10; // Round to 1 decimal place
  };

  const averageRating = calculateAverageRating();
  const attributeCount = formData.ratingBreakdown ? Object.keys(formData.ratingBreakdown).length : 0;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{isEdit ? "Update Final Report?" : "Submit Final Report?"}</h2>
          <button className={styles.closeButton} onClick={onClose} disabled={isSubmitting}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.warningSection}>
            <div className={styles.warningIcon}>⚠️</div>
            <div className={styles.warningContent}>
              <p className={styles.warningText}>
                You are about to submit this report as a <strong>final draft</strong> for <strong>{athleteName}</strong>
                .
              </p>
              <p className={styles.warningSubtext}>
                Once submitted, this report will be sent to the admin panel for review. After finalization, the Player
                Evaluation section will be <strong>locked and cannot be edited further</strong>.
              </p>
            </div>
          </div>

          <div className={styles.ratingPreview}>
            <h3 className={styles.previewTitle}>Final Rating Summary</h3>
            <div className={styles.ratingDisplay}>
              <div className={styles.diamondContainer}>
                <DiamondRating rating={averageRating} size="large" showValue={true} className={styles.previewRating} />
              </div>
              <div className={styles.ratingDetails}>
                <div className={styles.ratingValue}>
                  <span className={styles.ratingNumber}>{averageRating.toFixed(1)}</span>
                  <span className={styles.ratingScale}>/ 5.0</span>
                </div>
                <div className={styles.ratingMeta}>
                  Based on {attributeCount} evaluation{attributeCount !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>

          {formData.ratingBreakdown && Object.keys(formData.ratingBreakdown).length > 0 && (
            <div className={styles.attributeBreakdown}>
              <h4 className={styles.breakdownTitle}>Rating Breakdown</h4>
              <div className={styles.attributeList}>
                {Object.entries(formData.ratingBreakdown).map(([attribute, rating]) => (
                  <div key={attribute} className={styles.attributeItem}>
                    <span className={styles.attributeName}>{attribute}</span>
                    <span className={styles.attributeScore}>{rating.score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.confirmationText}>
            <p>Are you sure you want to {isEdit ? "update" : "submit"} this report as final?</p>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting
              ? isEdit
                ? "Updating..."
                : "Submitting..."
              : isEdit
              ? "Update Final Report"
              : "Submit Final Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
