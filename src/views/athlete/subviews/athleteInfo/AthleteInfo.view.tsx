"use client";

import React from "react";
import styles from "./AthleteInfo.module.scss";
import { IAthlete } from "@/types/IAthlete";
import Loader from "@/components/loader/Loader.component";

interface AthleteInfoProps {
  athlete?: IAthlete;
  loading?: boolean;
  error?: any;
}

const AthleteInfo: React.FC<AthleteInfoProps> = ({ athlete, loading, error }) => {
  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <Loader />
        <p>Loading athlete information...</p>
      </div>
    );
  }

  if (error || !athlete) {
    return (
      <div className={styles.errorWrapper}>
        <p>Unable to load athlete information</p>
      </div>
    );
  }

  const formatDate = (date?: Date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatMeasurement = (measurements?: Map<string, string | number>) => {
    if (!measurements) return null;
    return Object.entries(measurements).map(([key, value]) => (
      <div key={key} className={styles.measurementItem}>
        <span className={styles.measurementLabel}>{key}:</span>
        <span className={styles.measurementValue}>{value}</span>
      </div>
    ));
  };

  const formatMetrics = (metrics?: Map<string, number>) => {
    if (!metrics) return null;
    return Object.entries(metrics).map(([key, value]) => (
      <div key={key} className={styles.metricItem}>
        <span className={styles.metricLabel}>{key}:</span>
        <span className={styles.metricValue}>{value}</span>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      {/* Personal Information Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Personal Information</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Full Name:</span>
            <span className={styles.value}>{athlete.fullName}</span>
          </div>

          {athlete.birthdate && (
            <div className={styles.infoItem}>
              <span className={styles.label}>Date of Birth:</span>
              <span className={styles.value}>{formatDate(athlete.birthdate)}</span>
            </div>
          )}

          {athlete.birthPlace && (
            <div className={styles.infoItem}>
              <span className={styles.label}>Place of Birth:</span>
              <span className={styles.value}>
                {athlete.birthPlace.city}, {athlete.birthPlace.state}, {athlete.birthPlace.country}
              </span>
            </div>
          )}

          {athlete.contactNumber && (
            <div className={styles.infoItem}>
              <span className={styles.label}>Contact:</span>
              <span className={styles.value}>{athlete.contactNumber}</span>
            </div>
          )}

          {athlete.email && (
            <div className={styles.infoItem}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{athlete.email}</span>
            </div>
          )}
        </div>
      </section>

      {/* Athletic Information Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Athletic Information</h3>
        <div className={styles.infoGrid}>
          {athlete.positions && athlete.positions.length > 0 && (
            <div className={styles.infoItem}>
              <span className={styles.label}>Positions:</span>
              <div className={styles.positions}>
                {athlete.positions.map((position: any, index: number) => (
                  <span key={index} className={styles.positionTag}>
                    {position.name} ({position.abbreviation})
                  </span>
                ))}
              </div>
            </div>
          )}

          {athlete.experienceYears && (
            <div className={styles.infoItem}>
              <span className={styles.label}>Experience:</span>
              <span className={styles.value}>{athlete.experienceYears} years</span>
            </div>
          )}

          {athlete.diamondRating && (
            <div className={styles.infoItem}>
              <span className={styles.label}>Diamond Rating:</span>
              <div className={styles.ratingStars}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`${styles.star} ${i < athlete.diamondRating! ? styles.filled : ""}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Education Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Education</h3>
        <div className={styles.infoGrid}>
          {athlete.college && (
            <div className={styles.infoItem}>
              <span className={styles.label}>College:</span>
              <span className={styles.value}>{athlete.college}</span>
            </div>
          )}

          {athlete.highSchool && (
            <div className={styles.infoItem}>
              <span className={styles.label}>High School:</span>
              <span className={styles.value}>{athlete.highSchool}</span>
            </div>
          )}

          {athlete.graduationYear && (
            <div className={styles.infoItem}>
              <span className={styles.label}>Graduation Year:</span>
              <span className={styles.value}>{athlete.graduationYear}</span>
            </div>
          )}
        </div>
      </section>

      {/* Physical Measurements Section */}
      {athlete.measurements && Object.keys(athlete.measurements).length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Physical Measurements</h3>
          <div className={styles.measurementsGrid}>{formatMeasurement(athlete.measurements)}</div>
        </section>
      )}

      {/* Performance Metrics Section */}
      {athlete.metrics && Object.keys(athlete.metrics).length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Performance Metrics</h3>
          <div className={styles.metricsGrid}>{formatMetrics(athlete.metrics)}</div>
        </section>
      )}

      {/* Draft Information Section */}
      {athlete.draft && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Draft Information</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Draft Year:</span>
              <span className={styles.value}>{athlete.draft.year}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Round:</span>
              <span className={styles.value}>{athlete.draft.round}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Pick:</span>
              <span className={styles.value}>{athlete.draft.pick}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Team:</span>
              <span className={styles.value}>{athlete.draft.team}</span>
            </div>
          </div>
        </section>
      )}

      {/* Awards Section */}
      {athlete.awards && athlete.awards.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Awards & Achievements</h3>
          <div className={styles.awardsList}>
            {athlete.awards.map((award, index) => (
              <div key={index} className={styles.awardItem}>
                {award}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Biography Section */}
      {athlete.bio && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Biography</h3>
          <p className={styles.bioText}>{athlete.bio}</p>
        </section>
      )}

      {/* Analysis Section */}
      {(athlete.strengths || athlete.weaknesses || athlete.testimony) && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Analysis</h3>

          {athlete.strengths && (
            <div className={styles.analysisItem}>
              <h4 className={styles.analysisTitle}>Strengths</h4>
              <p className={styles.analysisText}>{athlete.strengths}</p>
            </div>
          )}

          {athlete.weaknesses && (
            <div className={styles.analysisItem}>
              <h4 className={styles.analysisTitle}>Weaknesses</h4>
              <p className={styles.analysisText}>{athlete.weaknesses}</p>
            </div>
          )}

          {athlete.testimony && (
            <div className={styles.analysisItem}>
              <h4 className={styles.analysisTitle}>Testimony</h4>
              <p className={styles.analysisText}>{athlete.testimony}</p>
            </div>
          )}
        </section>
      )}

      {/* External Links Section */}
      {athlete.links && athlete.links.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>External Links</h3>
          <div className={styles.linksList}>
            {athlete.links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={styles.linkItem}
                target={link.isExternal ? "_blank" : "_self"}
                rel={link.isExternal ? "noopener noreferrer" : ""}
              >
                {link.text}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Highlight Videos Section */}
      {athlete.highlightVideos && athlete.highlightVideos.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Highlight Videos</h3>
          <div className={styles.videosList}>
            {athlete.highlightVideos.map((video, index) => (
              <div key={index} className={styles.videoItem}>
                <a href={video} target="_blank" rel="noopener noreferrer" className={styles.videoLink}>
                  Video {index + 1}
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AthleteInfo;
