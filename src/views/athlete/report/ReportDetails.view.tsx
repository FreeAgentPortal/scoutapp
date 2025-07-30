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

const ReportDetails = () => {
  const params = useParams();
  const router = useRouter();
  const athleteId = params?.id as string;

  // Fetch athlete data to display athlete info
  const { data, isLoading, isError, error } = useApiHook({
    method: "GET",
    url: `/profiles/athlete/${athleteId}`,
    key: ["athlete", athleteId],
    enabled: !!athleteId,
  }) as any;

  const athlete = data?.payload as IAthlete;

  const handleFormSubmit = async (formData: Partial<IScoutReport>) => {
    try {
      // Submit the report using your API
      const response = await fetch("/api/scout-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirect back to athlete profile on success
        router.push(`/athlete/${athleteId}`);
      } else {
        // Handle error
        console.error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  const handleFormCancel = () => {
    router.push(`/athlete/${athleteId}`);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <Loader />
          <p>Loading athlete information...</p>
        </div>
      </div>
    );
  }

  if (isError || !athlete) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <h2>Error Loading Athlete</h2>
          <p>{error?.message || "Failed to load athlete data"}</p>
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
          <span className={styles.breadcrumbCurrent}>New Report</span>
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
        <div className={styles.reportFormContainer}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Create Scout Report</h2>
            <p className={styles.formSubtitle}>Generate a professional evaluation for {athlete.fullName}</p>
          </div>

          {/* Report Form Component */}
          <ReportForm athleteId={athleteId} athlete={athlete} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
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
