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

interface ScoutReportsProps {
  athleteId: string;
  athlete?: IAthlete;
}

const ScoutReports: React.FC<ScoutReportsProps> = ({ athleteId, athlete }) => {
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
        {reports.map((report) => (
          <ScoutReportCard
            key={report._id}
            report={report}
            onClick={() => {
              // Navigate to detailed report view
              window.location.href = `/reports/${report._id}`;
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ScoutReports;
