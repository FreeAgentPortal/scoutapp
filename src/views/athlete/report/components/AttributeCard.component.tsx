"use client";

import React from "react";
import styles from "../ReportDetails.module.scss";

interface AttributeCardProps {
  attribute: string;
  score: number;
  comments?: string;
  onRemove?: () => void;
  readOnly?: boolean;
}

const AttributeCard: React.FC<AttributeCardProps> = ({ attribute, score, comments, onRemove, readOnly = false }) => {
  return (
    <div className={`${styles.attributeCard} ${readOnly ? styles.readOnly : ""}`}>
      <div className={styles.attributeHeader}>
        <div className={styles.attributeInfo}>
          <h5 className={styles.attributeName}>{attribute}</h5>
          <div className={styles.attributeScore}>
            {readOnly ? (
              // Read-only mode with star rating display
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--text-secondary, #ccc)" }}>Score:</span>
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        fontSize: "1.25rem",
                        color: star <= score ? "#fbbf24" : "#374151",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: "1rem", fontWeight: "600", color: "var(--primary-light, #b3e6fc)" }}>
                  {score}/5
                </span>
              </div>
            ) : (
              // Regular mode with simple score display
              <span className={styles.scoreValue}>Score: {score}/5</span>
            )}
          </div>
        </div>
        {!readOnly && onRemove && (
          <button type="button" onClick={onRemove} className={styles.removeButton}>
            Remove
          </button>
        )}
      </div>

      {comments && <div className={styles.attributeComments}>&quot;{comments}&quot;</div>}
    </div>
  );
};

export default AttributeCard;
