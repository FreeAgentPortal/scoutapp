"use client";

import React from "react";
import styles from "../ReportDetails.module.scss";

interface AttributeCardProps {
  attribute: string;
  score: number;
  comments?: string;
  onRemove: () => void;
}

const AttributeCard: React.FC<AttributeCardProps> = ({ attribute, score, comments, onRemove }) => {
  return (
    <div className={styles.attributeCard}>
      <div className={styles.attributeHeader}>
        <div className={styles.attributeInfo}>
          <h5 className={styles.attributeName}>{attribute}</h5>
          <div className={styles.attributeScore}>
            <span className={styles.scoreValue}>Score: {score}/5</span>
          </div>
        </div>
        <button type="button" onClick={onRemove} className={styles.removeButton}>
          Remove
        </button>
      </div>

      {comments && <div className={styles.attributeComments}>&quot;{comments}&quot;</div>}
    </div>
  );
};

export default AttributeCard;
