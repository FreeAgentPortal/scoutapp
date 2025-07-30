"use client";

import React from "react";
import Link from "next/link";
import styles from "./ScoutReports.module.scss";
import { IAthlete } from "@/types/IAthlete";
import useApiHook from "@/hooks/useApi";
import Loader from "@/components/loader/Loader.component";
import { IScoutReport } from "@/types/IScoutReport";

interface ScoutReportsProps {
  athleteId: string;
  athlete?: IAthlete;
}

const ScoutReports: React.FC<ScoutReportsProps> = ({ athleteId, athlete }) => {
  // Fetch scout reports for this athlete
  const { data, isLoading, isError, error } = useApiHook({
    method: "GET",
    url: `/scout`,
    filter: `athleteId;${athleteId}|isFinalized;true`,
    key: ["scout-reports", athleteId],
    enabled: !!athleteId,
  }) as any;

  const reports = data?.payload as IScoutReport[];

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <Loader />
        <p>Loading scout reports...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.errorWrapper}>
        <p>Unable to load scout reports</p>
        <span className={styles.errorDetail}>{error?.message}</span>
      </div>
    );
  }

  // If no reports found, show empty state
  if (!reports || reports.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <h2 className={styles.title}>Scout Reports (0)</h2>
              <p className={styles.subtitle}>Professional evaluations and assessments for {athlete?.fullName}</p>
            </div>
            <div className={styles.headerActions}>
              <Link href={`/athlete/${athleteId}/report-new`} className={styles.createReportButton}>
                <span className={styles.buttonIcon}>📝</span>
                Create New Report
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <h3 className={styles.emptyTitle}>No Scout Reports Yet</h3>
          <p className={styles.emptyDescription}>
            This athlete hasn&apos;t been evaluated by any scouts yet. Scout reports will appear here once they&apos;re submitted.
          </p>
          <div className={styles.emptyActions}>
            <Link href={`/athlete/${athleteId}/report-new`} className={styles.createReportButtonLarge}>
              <span className={styles.buttonIcon}>📝</span>
              Create First Report
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
      game: "Game Report",
      evaluation: "Evaluation",
      camp: "Camp Report",
      combine: "Combine Report",
      interview: "Interview",
      other: "Other",
    };
    return typeLabels[reportType] || reportType;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h2 className={styles.title}>Scout Reports ({reports.length})</h2>
            <p className={styles.subtitle}>Professional evaluations and assessments for {athlete?.fullName}</p>
          </div>
          <div className={styles.headerActions}>
            <Link href={`/athlete/${athleteId}/report-new`} className={styles.createReportButton}>
              <span className={styles.buttonIcon}>📝</span>
              Create New Report
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.reportsList}>
        {reports.map((report) => (
          <div key={report._id} className={styles.reportCard}>
            {/* Report Header */}
            <div className={styles.reportHeader}>
              <div className={styles.scoutInfo}>
                <div className={styles.scoutProfile}>
                  <div className={styles.scoutAvatarPlaceholder}>{report.scout?.displayName?.charAt(0) || "S"}</div>
                  <div className={styles.scoutDetails}>
                    <h3 className={styles.scoutName}>{report.scout?.displayName || "Anonymous Scout"}</h3>
                    {report.scout?.teams && report.scout.teams.length > 0 && (
                      <span className={styles.scoutOrg}>{report.scout.teams[0]}</span>
                    )}
                  </div>
                </div>
                <div className={styles.reportMeta}>
                  <span className={styles.reportType}>{getReportTypeLabel(report.reportType)}</span>
                  <span className={styles.reportDate}>{formatDate(report.createdAt)}</span>
                  {report.sport && (
                    <span className={styles.sportLeague}>
                      {report.sport} {report.league && `• ${report.league}`}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.overallRating}>
                <span className={styles.ratingLabel}>Diamond Rating</span>
                <div className={`${styles.ratingValue} ${getRatingColor(report.diamondRating)}`}>
                  {report.diamondRating}/5
                </div>
                <div className={styles.ratingStars}>{renderStars(report.diamondRating)}</div>
              </div>
            </div>

            {/* Report Status and Type Info */}
            <div className={styles.reportInfo}>
              <div className={styles.statusBadges}>
                {report.isFinalized && <span className={styles.finalizedBadge}>✓ Finalized</span>}
                {report.isDraft && <span className={styles.draftBadge}>📝 Draft</span>}
                {report.isPublic && <span className={styles.publicBadge}>🌐 Public</span>}
                {report.status && (
                  <span className={`${styles.statusBadge} ${styles[report.status]}`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                )}
              </div>

              {report.tags && report.tags.length > 0 && (
                <div className={styles.tags}>
                  {report.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Limited Visibility Notice */}
            <div className={styles.privacyNotice}>
              <span className={styles.privacyIcon}>🔒</span>
              <span className={styles.privacyText}>Detailed evaluation content is private to the reporting scout</span>
            </div>

            {/* Report Footer */}
            <div className={styles.reportFooter}>
              <span className={styles.reportId}>ID: {report._id.slice(-8)}</span>
              <span className={styles.createdDate}>Created: {formatDate(report.createdAt)}</span>
              {report.updatedAt !== report.createdAt && (
                <span className={styles.updatedDate}>Updated: {formatDate(report.updatedAt)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoutReports;
