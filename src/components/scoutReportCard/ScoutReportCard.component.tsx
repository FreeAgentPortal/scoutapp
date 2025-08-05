"use client";

import React from "react";
import styles from "./ScoutReportCard.module.scss";
import { ScoutReportCardProps } from "./ScoutReportCard.types";

const ScoutReportCard: React.FC<ScoutReportCardProps> = ({ report, onClick }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return styles.excellent;
    if (rating >= 3) return styles.good;
    if (rating >= 2) return styles.average;
    return styles.poor;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`${styles.star} ${i < rating ? styles.filled : ""}`}>
        ★
      </span>
    ));
  };

  const getReportTypeLabel = (reportType: string) => {
    const typeLabels: Record<string, string> = {
      game: "Game",
      evaluation: "Eval",
      camp: "Camp",
      combine: "Combine",
      interview: "Interview",
      other: "Other",
    };
    return typeLabels[reportType] || reportType;
  };

  return (
    <div className={`${styles.reportCard} ${onClick ? styles.clickable : ""}`} onClick={onClick}>
      {/* Scout Profile & Basic Info */}
      <div className={styles.cardHeader}>
        <div className={styles.scoutProfile}>
          <div className={styles.scoutAvatar}>{report.scout?.displayName?.charAt(0) || "S"}</div>
          <div className={styles.scoutInfo}>
            <h4 className={styles.scoutName}>
              {report.scout?.displayName || report.scout?.user?.fullName || "Anonymous Scout"}
            </h4>
            {report.scout?.teams && report.scout.teams.length > 0 && (
              <span className={styles.scoutOrg}>{report.scout.teams[0]}</span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className={styles.rating}>
          <div className={`${styles.ratingValue} ${getRatingColor(report.diamondRating)}`}>{report.diamondRating}</div>
          <div className={styles.ratingStars}>{renderStars(report.diamondRating)}</div>
        </div>
      </div>

      {/* Report Details */}
      <div className={styles.cardBody}>
        <div className={styles.reportMeta}>
          <span className={styles.reportType}>{getReportTypeLabel(report.reportType)}</span>
          <span className={styles.reportDate}>{formatDate(report.createdAt)}</span>
          {report.sport && (
            <span className={styles.sportInfo}>
              {report.sport}
              {report.league && ` • ${report.league}`}
            </span>
          )}
        </div>

        {/* Status Badges */}
        <div className={styles.statusBadges}>
          {report.isFinalized && <span className={styles.finalizedBadge}>✓</span>}
          {report.isDraft && <span className={styles.draftBadge}>📝</span>}
          {report.isPublic && <span className={styles.publicBadge}>🌐</span>}
          {report.status && <span className={`${styles.statusBadge} ${styles[report.status]}`}>{report.status}</span>}
        </div>
      </div>
    </div>
  );
};

export default ScoutReportCard;
