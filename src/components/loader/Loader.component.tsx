"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Loader.component.module.scss";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = "medium", color = "var(--primary)", className = "" }) => {
  return (
    <div className={`${styles.container} ${styles[size]} ${className}`}>
      <motion.div
        className={styles.spinner}
        style={{ borderTopColor: color }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loader;
