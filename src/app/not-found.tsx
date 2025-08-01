"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./not-found.module.scss";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={styles.iconSection}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.icon}>🏈</div>
          <div className={styles.number}>404</div>
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Page Not Found
        </motion.h1>

        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Looks like this play didn&apos;t work out! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.button
            className={styles.button}
            onClick={handleGoBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </motion.button>

          <motion.button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={handleGoHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Dashboard
          </motion.button>
        </motion.div>

        <motion.div
          className={styles.suggestions}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className={styles.suggestionsTitle}>Try these instead:</h3>
          <ul className={styles.suggestionsList}>
            <li>
              <Link href="/search" className={styles.suggestionLink}>
                Search Athletes
              </Link>
            </li>
            <li>
              <Link href="/reports" className={styles.suggestionLink}>
                My Reports
              </Link>
            </li>
            <li>
              <Link href="/favorites" className={styles.suggestionLink}>
                Favorites
              </Link>
            </li>
            <li>
              <Link href="/settings" className={styles.suggestionLink}>
                Settings
              </Link>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
