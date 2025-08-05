"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "./Athlete.module.scss";
import { Tabs } from "@/components/tabs";
import useApiHook from "@/hooks/useApi";
import { IAthlete } from "@/types/IAthlete";
import AthleteInfo from "./subviews/athleteInfo/AthleteInfo.view";
import ScoutReports from "./subviews/scoutReports/ScoutReports.view";
import Loader from "@/components/loader/Loader.component";
import Image from "next/image";
import { useSearchStore } from "@/state/search";

const Athlete = () => {
  const params = useParams();
  const athleteId = params?.id as string;
  const [activeTab, setActiveTab] = useState("info");

  const { setPageNumber, pageNumber } = useSearchStore((state) => state);

  // Fetch athlete data
  const { data, isLoading, isError, error, refetch } = useApiHook({
    method: "GET",
    url: `/profiles/athlete/${athleteId}`,
    key: ["athlete", athleteId],
    enabled: !!athleteId,
  }) as any;

  const athlete = data?.payload as IAthlete;

  useEffect(() => {
    setPageNumber(1); // Reset page number when athleteId changes
  }, [athleteId, setPageNumber]);
  const tabItems = [
    {
      id: "info",
      label: "Athlete Info",
      component: <AthleteInfo athlete={athlete} loading={isLoading} error={error} />,
    },
    {
      id: "reports",
      label: "Scout Reports",
      component: <ScoutReports athleteId={athleteId} athlete={athlete} />,
    },
  ];

  if (isLoading && !athlete) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <Loader />
          <p>Loading athlete profile...</p>
        </div>
      </div>
    );
  }

  if (isError && !athlete) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <h2>Error Loading Athlete</h2>
          <p>{error?.message || "Failed to load athlete data"}</p>
          <button onClick={() => refetch?.()} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {athlete && (
        <div className={styles.header}>
          <div className={styles.athleteBasic}>
            <div className={styles.imageWrapper}>
              {athlete.profileImageUrl ? (
                <Image
                  src={athlete.profileImageUrl}
                  alt={athlete.fullName}
                  className={styles.profileImage}
                  width={100}
                  height={100}
                />
              ) : (
                <div className={styles.placeholderImage}>
                  <span>{athlete.fullName.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className={styles.basicInfo}>
              <h1 className={styles.name}>{athlete.fullName}</h1>
              {athlete.positions && athlete.positions.length > 0 && (
                <div className={styles.positions}>
                  {athlete.positions.map((position, index) => (
                    <span key={index} className={styles.position}>
                      {position.name}
                    </span>
                  ))}
                </div>
              )}
              {athlete.college && <p className={styles.college}>{athlete.college}</p>}
              {athlete.diamondRating && (
                <div className={styles.rating}>
                  <span className={styles.ratingLabel}>Diamond Rating:</span>
                  <div className={styles.stars}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={`${styles.star} ${i < athlete.diamondRating! ? styles.filled : ""}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <Tabs tabs={tabItems} activeTab={activeTab} onTabChange={setActiveTab} className={styles.tabs} />
      </div>
    </div>
  );
};

export default Athlete;
