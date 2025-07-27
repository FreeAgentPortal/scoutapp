"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/layout/authProvider/AuthProvider.layout";
import { logout } from "@/state/auth";
import styles from "./Navbar.module.scss";

const Navbar: React.FC = () => {
  const { user } = useAuth();

  const handleLogout = () => {
    logout(false);
  };

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.headerContent}>
        <div className={styles.logoSection}>
          <span className={styles.logo}>🏈</span>
          <div>
            <h1 className={styles.title}>FAP Scout</h1>
            <p className={styles.subtitle}>Free Agent Portal</p>
          </div>
        </div>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>
              {user?.firstName} {user?.lastName}
            </span>
            <span className={styles.userRole}>{user?.role}</span>
          </div>
          <motion.button
            className={styles.logoutButton}
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
