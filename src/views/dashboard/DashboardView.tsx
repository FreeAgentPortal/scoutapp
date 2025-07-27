"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/layout/authProvider/AuthProvider.layout";
import { actionCardsData } from "./cards";
import styles from "./DashboardView.module.scss";

const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleCardClick = (route: string) => {
    router.push(route);
  };

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
          {actionCardsData.map((card) => (
            <motion.div
              key={card.id}
              className={styles.actionCard}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => handleCardClick(card.route)}
            >
              <div className={styles.actionIcon}>{card.icon}</div>
              <h3 className={styles.actionTitle}>{card.title}</h3>
              <p className={styles.actionDescription}>{card.description}</p>
              <motion.button
                className={styles.actionButton}
                whileHover={{ backgroundColor: "var(--primary-dark)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(card.route);
                }}
              >
                {card.buttonText}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardView;
