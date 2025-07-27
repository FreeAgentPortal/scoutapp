"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/layout/authProvider/AuthProvider.layout";
import styles from "./DashboardView.module.scss";

const DashboardView: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.welcomeSection}>
          <h2 className={styles.welcomeTitle}>Welcome back, {user?.firstName}!</h2>
          <p className={styles.welcomeText}>
            Ready to scout some talent? Use the tools below to search for athletes and generate detailed reports.
          </p>
        </div>

        <div className={styles.actionsGrid}>
          <motion.div
            className={styles.actionCard}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className={styles.actionIcon}>🔍</div>
            <h3 className={styles.actionTitle}>Search Athletes</h3>
            <p className={styles.actionDescription}>Find and browse through our database of athletes</p>
            <motion.button className={styles.actionButton} whileHover={{ backgroundColor: "var(--primary-dark)" }}>
              Start Search
            </motion.button>
          </motion.div>

          <motion.div
            className={styles.actionCard}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className={styles.actionIcon}>📊</div>
            <h3 className={styles.actionTitle}>My Reports</h3>
            <p className={styles.actionDescription}>View and manage your scout reports</p>
            <motion.button className={styles.actionButton} whileHover={{ backgroundColor: "var(--primary-dark)" }}>
              View Reports
            </motion.button>
          </motion.div>

          <motion.div
            className={styles.actionCard}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className={styles.actionIcon}>⭐</div>
            <h3 className={styles.actionTitle}>Favorites</h3>
            <p className={styles.actionDescription}>Quick access to your starred athletes</p>
            <motion.button className={styles.actionButton} whileHover={{ backgroundColor: "var(--primary-dark)" }}>
              View Favorites
            </motion.button>
          </motion.div>

          <motion.div
            className={styles.actionCard}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className={styles.actionIcon}>⚙️</div>
            <h3 className={styles.actionTitle}>Settings</h3>
            <p className={styles.actionDescription}>Customize your scouting preferences</p>
            <motion.button className={styles.actionButton} whileHover={{ backgroundColor: "var(--primary-dark)" }}>
              Open Settings
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardView;
