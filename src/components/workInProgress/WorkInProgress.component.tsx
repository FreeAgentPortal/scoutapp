"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./WorkInProgress.module.scss";

interface WorkInProgressProps {
  title: string;
  description?: string;
  icon?: string;
}

const WorkInProgress: React.FC<WorkInProgressProps> = ({
  title,
  description = "This feature is currently being developed. Check back soon!",
  icon = "🚧",
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
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
          className={styles.icon}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {icon}
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {description}
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
      </motion.div>
    </div>
  );
};

export default WorkInProgress;
