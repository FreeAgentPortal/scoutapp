"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./LoadingView.module.scss";

const LoadingView: React.FC = () => {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={styles.logo}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🏈
        </motion.div>
        <h1 className={styles.title}>Free Agent Portal</h1>
        <p className={styles.subtitle}>Scout Platform</p>

        <motion.div
          className={styles.loadingDots}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span animate={{ y: [-5, 5, -5] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
          <motion.span animate={{ y: [-5, 5, -5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
          <motion.span animate={{ y: [-5, 5, -5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingView;
