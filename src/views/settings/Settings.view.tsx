"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/layout/authProvider/AuthProvider.layout";
import useApi from "@/hooks/useApi";
import { Tabs, type TabItem } from "@/components/tabs";
import UserProfile from "./subviews/accountSettings/UserProfile.tab";
import ScoutProfile from "./subviews/scoutSettings/ScoutProfile.tab";
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
        <Tabs tabs={tabs} defaultActiveTab="user" childrenClassName={styles.main}/>
      </motion.div>
    </div>
  );
};

export default Settings;
