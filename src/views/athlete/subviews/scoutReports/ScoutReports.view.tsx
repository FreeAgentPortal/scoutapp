"use client";

import React from "react";
import Link from "next/link";
import styles from "./ScoutReports.module.scss";
import { IAthlete } from "@/types/IAthlete";
import useApiHook from "@/hooks/useApi";
import Loader from "@/components/loader/Loader.component";
import { IScoutReport } from "@/types/IScoutReport";
import { useSearchStore } from "@/state/search";
import ScoutReportCard from "@/components/scoutReportCard";
import { useUser } from "@/state/auth";

interface ScoutReportsProps {
  athleteId: string;
  athlete?: IAthlete;
}

const ScoutReports: React.FC<ScoutReportsProps> = ({ athleteId, athlete }) => {
  // Get current user to check report ownership
  const { data: currentUser } = useUser();

  // Fetch scout reports for this athlete
  const { pageNumber } = useSearchStore((state) => state);
  const { data, isLoading, isError, error } = useApiHook({
    method: "GET",
    url: `/scout`,
    filter: `athleteId;${athleteId}|isFinalized;true`,
    key: ["scout-reports", athleteId, pageNumber as any],
    enabled: !!athleteId,
  }) as any;

  const reports = data?.payload as IScoutReport[];

  // Helper function to check if current user owns the report
  const isUserReport = (report: IScoutReport): boolean => {
    if (!currentUser) return false;

    // Check if the scout's userId matches the current user's ID
    if (report.scout?.userId === currentUser._id) {
      return true;
    }

    // Fallback: check if scoutId directly matches user ID (in case scout profile isn't populated)
    if (report.scoutId === currentUser._id) {
      return true;
    }

    return false;
  };

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
            This athlete hasn&apos;t been evaluated by any scouts yet. Scout reports will appear here once they&apos;re
            submitted.
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
        {reports.map((report) => {
          const userOwnsReport = isUserReport(report);
          return (
            <ScoutReportCard
              key={report._id}
              report={report}
              onClick={
                userOwnsReport
                  ? () => {
                      // Navigate to detailed report view only if user owns the report
                      window.location.href = `/reports/${report._id}`;
                    }
                  : undefined
              }
              isRestricted={!userOwnsReport}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ScoutReports;
