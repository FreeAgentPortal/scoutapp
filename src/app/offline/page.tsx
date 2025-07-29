'use client';

import styles from './offline.module.scss';

export default function OfflinePage() {
  return (
    <div className={styles.offlineContainer}>
      <div className={styles.offlineContent}>
        <div className={styles.offlineIcon}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M8 15L12 11L16 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className={styles.offlineTitle}>You&apos;re Offline</h1>
        <p className={styles.offlineDescription}>
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry, you can still browse
          some content that&apos;s been saved on your device.
        </p>
        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
