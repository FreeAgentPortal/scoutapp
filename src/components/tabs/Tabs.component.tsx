"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Tabs.module.scss";
import type { TabsProps } from "./Tabs.types";

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab: externalActiveTab,
  onTabChange: externalOnTabChange,
  defaultActiveTab,
  className = "",
  // classname for children components
  childrenClassName = "",
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultActiveTab || tabs[0]?.id || "");

  // Use external state if provided, otherwise use internal state
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (externalOnTabChange) {
      externalOnTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={`${styles.tabContainer} ${className}`}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => handleTabChange(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {tab.icon && <span className={styles.tabIcon}>{tab.icon as any}</span>}
            <span className={styles.tabLabel}>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                className={styles.tabIndicator}
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className={`${styles.tabContent} ${childrenClassName}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTabData &&
              (React.isValidElement(activeTabData.component)
                ? activeTabData.component
                : React.createElement(activeTabData.component as React.ComponentType<any>, activeTabData.props || {}))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs;
