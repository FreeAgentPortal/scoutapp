"use client";

import React from "react";
import styles from "./ReportDetails.module.scss";
import { useParams, useRouter } from "next/navigation";
import useApiHook from "@/hooks/useApi";
import { IAthlete } from "@/types/IAthlete";
import { IScoutReport } from "@/types/IScoutReport";
import Loader from "@/components/loader/Loader.component";
import Link from "next/link";
import ReportForm from "./components/ReportForm.component";
import { IScoutProfile } from "@/types/IScoutProfile";
import { useQueryClient } from "@tanstack/react-query";

const ReportDetails = () => {
  const params = useParams();
  const router = useRouter();
  const athleteId = params?.id as string;
  const reportId = params?.reportId as string; // For edit mode
  const isEditMode = !!reportId;

  const scoutProfile = useQueryClient().getQueryData(["profile", "scout"]) as { payload: IScoutProfile }; // Fetch athlete data to display athlete info
  const { data, isLoading, isError, error } = useApiHook({
    method: "GET",
    url: `/profiles/athlete/${athleteId}`,
    key: ["athlete", athleteId],
    enabled: !!athleteId,
  }) as any;

  // Fetch existing report data when in edit mode
  const {
    data: reportData,
    isLoading: isReportLoading,
    isError: isReportError,
  } = useApiHook({
    method: "GET",
    url: `/scout/${reportId}`,
    key: ["report", reportId],
    enabled: !!reportId && isEditMode,
  }) as any;

  const { mutate: createReport, isPending: isCreating } = useApiHook({
    method: "POST",
    key: ["createReport"],
    successMessage: "Report created successfully",
    queriesToInvalidate: [`athlete,${athleteId}`, `scout-reports,${athleteId}`],
    onSuccessCallback: () => {
      // Navigate back to athlete profile after successful creation
      router.push(`/athlete/${athleteId}`);
    },
  }) as any;

  const { mutate: updateReport, isPending: isUpdating } = useApiHook({
    method: "PUT",
    key: ["updateReport"],
    successMessage: `Report updated successfully`,
    queriesToInvalidate: [`athlete,${athleteId}`, `report,${reportId}`, `reports`],
    onSuccessCallback: () => {
      // Navigate back to reports list after successful update
      router.push("/reports");
    },
  }) as any;

  const athlete = data?.payload as IAthlete;
  const existingReport = reportData?.payload as IScoutReport;

  const handleFormSubmit = async (formData: Partial<IScoutReport>) => {
    if (isEditMode && existingReport) {
      // Update existing report
      updateReport({
        url: `/scout/${reportId}`,
        formData: {
          ...formData,
          athleteId: athlete._id,
          scoutId: scoutProfile?.payload?._id,
        },
      });
    } else {
      // Create new report
      createReport({
        url: `/scout`,
        formData: {
          ...formData,
          athleteId: athlete._id,
          scoutId: scoutProfile?.payload?._id,
        },
      });
    }
  };

  const handleFormCancel = () => {
    if (isEditMode) {
      // When editing, go back to reports list
      router.push("/reports");
    } else {
      // When creating, go back to athlete profile
      router.push(`/athlete/${athleteId}`);
    }
  };

  if (isLoading || (isEditMode && isReportLoading)) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <Loader />
          <p>Loading {isEditMode ? "report and athlete" : "athlete"} information...</p>
        </div>
      </div>
    );
  }

  if (isError || !athlete || (isEditMode && (isReportError || !existingReport))) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <h2>Error Loading {isEditMode ? "Report" : "Athlete"}</h2>
          <p>{error?.message || `Failed to load ${isEditMode ? "report" : "athlete"} data`}</p>
          <div className={styles.errorActions}>
            <Link href={`/athlete/${athleteId}`} className={styles.backButton}>
              Back to Athlete Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Loading overlay during form submission */}
      {(isCreating || isUpdating) && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingModal}>
            <Loader />
            <p>{isEditMode ? "Updating report..." : "Creating report..."}</p>
            <p className={styles.loadingSubtext}>
              {isEditMode ? "Your changes are being saved" : "Please wait while we save your evaluation"}
            </p>
          </div>
        </div>
      )}

      {/* Header with athlete info and navigation */}
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link href="/search" className={styles.breadcrumbLink}>
            Search
          </Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <Link href={`/athlete/${athleteId}`} className={styles.breadcrumbLink}>
            {athlete.fullName}
          </Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span className={styles.breadcrumbCurrent}>{isEditMode ? "Edit Report" : "New Report"}</span>
        </div>

        <div className={styles.athleteHeader}>
          <div className={styles.athleteInfo}>
            <div className={styles.athleteImageWrapper}>
              {athlete.profileImageUrl ? (
                <img src={athlete.profileImageUrl} alt={athlete.fullName} className={styles.athleteImage} />
              ) : (
                <div className={styles.athletePlaceholder}>{athlete.fullName.charAt(0)}</div>
              )}
            </div>
            <div className={styles.athleteDetails}>
              <h1 className={styles.athleteName}>{athlete.fullName}</h1>
              {athlete.positions && athlete.positions.length > 0 && (
                <div className={styles.positions}>
                  {athlete.positions.map((position: any, index: number) => (
                    <span key={index} className={styles.position}>
                      {position.name}
                    </span>
                  ))}
                </div>
              )}
              {athlete.college && <p className={styles.college}>{athlete.college}</p>}
            </div>
          </div>
          <div className={styles.headerActions}>
            <Link href={`/athlete/${athleteId}`} className={styles.backButton}>
              ← Back to Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className={styles.content}>
        <div className={`${styles.reportFormContainer} ${isCreating || isUpdating ? styles.submitting : ""}`}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {isEditMode ? "Edit Scout Report" : "Create Scout Report"}
              {isEditMode && existingReport?.isFinalized && (
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontSize: "0.875rem",
                    color: "var(--color-warning, #ffc107)",
                    fontWeight: "normal",
                  }}
                >
                  🔒 Finalized
                </span>
              )}
            </h2>
            <p className={styles.formSubtitle}>
              {isEditMode
                ? existingReport?.isFinalized
                  ? `This report has been finalized. Only observations, strengths, weaknesses, and settings can be modified for ${athlete.fullName}.`
                  : `Update your evaluation for ${athlete.fullName}. You can modify all sections until the report is finalized by an administrator.`
                : `Generate a professional evaluation for ${athlete.fullName}`}
            </p>
          </div>

          {/* Report Form Component */}
          <ReportForm
            athleteId={athleteId}
            athlete={athlete}
            existingReport={existingReport}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isSubmitting={isCreating || isUpdating}
          />
        </div>

        {/* Sidebar with helpful information */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Report Guidelines</h3>
            <ul className={styles.guidelinesList}>
              <li>Be objective and professional in your evaluation</li>
              <li>Provide specific examples when noting strengths or weaknesses</li>
              <li>Use verified metrics when available</li>
              <li>Consider the athlete&apos;s potential for improvement</li>
              <li>Maintain confidentiality as appropriate</li>
            </ul>
          </div>

          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Rating Scale</h3>
            <div className={styles.ratingGuide}>
              <div className={styles.ratingItem}>
                <span className={styles.ratingValue}>5</span>
                <span className={styles.ratingLabel}>Exceptional</span>
              </div>
              <div className={styles.ratingItem}>
                <span className={styles.ratingValue}>4</span>
                <span className={styles.ratingLabel}>Above Average</span>
              </div>
              <div className={styles.ratingItem}>
                <span className={styles.ratingValue}>3</span>
                <span className={styles.ratingLabel}>Average</span>
              </div>
              <div className={styles.ratingItem}>
                <span className={styles.ratingValue}>2</span>
                <span className={styles.ratingLabel}>Below Average</span>
              </div>
              <div className={styles.ratingItem}>
                <span className={styles.ratingValue}>1</span>
                <span className={styles.ratingLabel}>Poor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
