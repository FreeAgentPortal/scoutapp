"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className={styles.footer}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className={styles.footerContent}>
        <div className={styles.logoSection}>
          <span className={styles.logo}>🏈</span>
          <div>
            <h3 className={styles.title}>FAP Scout</h3>
            <p className={styles.subtitle}>Free Agent Portal</p>
          </div>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.linkGroup}>
            <h4 className={styles.linkGroupTitle}>Scouting</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="#" className={styles.link}>
                  Search Athletes
                </a>
              </li>
              <li>
                <a href="#" className={styles.link}>
                  My Reports
                </a>
              </li>
              <li>
                <a href="#" className={styles.link}>
                  Favorites
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4 className={styles.linkGroupTitle}>Account</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="#" className={styles.link}>
                  Profile
                </a>
              </li>
              <li>
                <a href="#" className={styles.link}>
                  Settings
                </a>
              </li>
              <li>
                <a href="#" className={styles.link}>
                  Help
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.copyrightSection}>
          <p className={styles.copyright}>© {currentYear} FAP Scout. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <a href="#" className={styles.legalLink}>
              Privacy Policy
            </a>
            <span className={styles.separator}>•</span>
            <a href="#" className={styles.legalLink}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
