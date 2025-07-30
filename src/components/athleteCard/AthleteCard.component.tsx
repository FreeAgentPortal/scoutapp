"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { AthleteCardProps, AthleteCardRef } from "./AthleteCard.types";
import styles from "./AthleteCard.module.scss";
import Link from "next/link";

const AthleteCard = forwardRef<AthleteCardRef, AthleteCardProps>(
  (
    {
      athlete,
      loading = false,
      size = "medium",
      showFullInfo = true,
      showActions = true,
      onClick,
      onToggleFavorite,
      isFavorited = false,
      className = "",
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      getAthlete: () => athlete,
    }));

    const handleCardClick = () => {
      if (onClick && !loading) {
        onClick(athlete);
      }
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onToggleFavorite && !loading) {
        onToggleFavorite(athlete);
      }
    };

    // Build CSS classes
    const cardClasses = [
      styles.athleteCard,
      styles[size],
      loading && styles.loading,
      onClick && styles.clickable,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (loading) {
      return (
        <div className={cardClasses}>
          <div className={styles.loadingSkeleton}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={cardClasses} onClick={handleCardClick}>
        {/* Athlete Image */}
        <div className={styles.imageContainer}>
          <Image
            src={athlete.profileImageUrl || "/images/no-photo.png"}
            alt={athlete.fullName || "Athlete photo"}
            width={200}
            height={200}
            className={styles.athleteImage}
            unoptimized
          />

          {/* Rating Badge */}
          {athlete.diamondRating && <div className={styles.ratingBadge}>⭐ {athlete.diamondRating.toFixed(1)}</div>}

          {/* Favorite Button */}
          {showActions && (
            <button
              className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ""}`}
              onClick={handleToggleFavorite}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill={isFavorited ? "currentColor" : "none"}
                />
              </svg>
            </button>
          )}
        </div>

        {/* Athlete Information */}
        <div className={styles.athleteInfo}>
          {/* Name */}
          <h3 className={styles.athleteName}>{athlete.fullName || "Unknown Athlete"}</h3>

          {/* Positions */}
          {athlete.positions && athlete.positions.length > 0 && (
            <div className={styles.positions}>
              {athlete.positions.slice(0, 3).map((position, index) => (
                <span key={index} className={styles.positionTag}>
                  {position.abbreviation || position.name || "POS"}
                </span>
              ))}
              {athlete.positions.length > 3 && (
                <span className={styles.positionMore}>+{athlete.positions.length - 3}</span>
              )}
            </div>
          )}

          {/* Basic Info */}
          <div className={styles.basicInfo}>
            {athlete.college && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>College:</span>
                <span className={styles.infoValue}>{athlete.college}</span>
              </div>
            )}

            {athlete.graduationYear && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Class:</span>
                <span className={styles.infoValue}>{athlete.graduationYear}</span>
              </div>
            )}

            {showFullInfo && athlete.experienceYears !== undefined && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Experience:</span>
                <span className={styles.infoValue}>
                  {athlete.experienceYears} {athlete.experienceYears === 1 ? "year" : "years"}
                </span>
              </div>
            )}

            {showFullInfo && athlete.birthPlace && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>From:</span>
                <span className={styles.infoValue}>
                  {[athlete.birthPlace.city, athlete.birthPlace.state].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className={styles.actions}>
              <Link href={`/athlete/${athlete._id}`} className={styles.viewButton}>
                View Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }
);

AthleteCard.displayName = "AthleteCard";

export default AthleteCard;
