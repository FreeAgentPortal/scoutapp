"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tabs } from "@/components/tabs";
import styles from "./Settings.module.scss";
import tabs from "./tabs";

const Settings = () => {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.header}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Manage your user account and scout profile settings</p>
        </div>
        <Tabs tabs={tabs} defaultActiveTab="user" childrenClassName={styles.main} />
      </motion.div>
    </div>
  );
};

export default Settings;
