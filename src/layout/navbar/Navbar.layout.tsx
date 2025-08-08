"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/layout/authProvider/AuthProvider.layout";
import { logout } from "@/state/auth";
import styles from "./Navbar.module.scss";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, [window.innerWidth]);

  const handleLogout = () => {
    logout(true);
    setIsDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const navigationLinks = [
    { href: "/", label: "Dashboard", icon: "🏠" },
    { href: "/search", label: "Search", icon: "🔍" },
    { href: "/reports", label: "Reports", icon: "📊" },
    { href: "/favorites", label: "Favorites", icon: "⭐" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
    { href: "/support", label: "Support", icon: "🆘" },
  ];

  return (
    <>
      <motion.header
        className={styles.header}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <Link href="/" className={styles.logoLink}>
              <span className={styles.logo}>🏈</span>
              <div>
                <h1 className={styles.title}>FAP Scout</h1>
                <p className={styles.subtitle}>Free Agent Portal</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && !isMobile && (
            <nav className={styles.navigation}>
              <ul className={styles.navList}>
                {navigationLinks.map((link) => (
                  <motion.li key={link.href} className={styles.navItem}>
                    <Link href={link.href} className={styles.navLink}>
                      <span className={styles.navIcon}>{link.icon}</span>
                      <span className={styles.navLabel}>{link.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          )}

          {/* Desktop User Section */}
          {!isMobile && (
            <div className={styles.userSection}>
              {user && (
                <>
                  <div className={styles.userProfile}>
                    <div className={styles.profileImageContainer}>
                      <Image
                        src={user.profileImageUrl || "/images/no-photo.png"}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={40}
                        height={40}
                        className={styles.profileImage}
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>
                        {user.firstName} {user.lastName}
                      </span>
                      <span className={styles.userRole}>{user.role}</span>
                    </div>
                  </div>
                  <motion.button
                    className={styles.logoutButton}
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </>
              )}
            </div>
          )}

          {/* Mobile Hamburger Menu */}
          {isMobile && user && (
            <button className={styles.hamburger} onClick={toggleDrawer} aria-label="Open menu">
              <span className={`${styles.hamburgerLine} ${isDrawerOpen ? styles.hamburgerLineActive : ""}`}></span>
              <span className={`${styles.hamburgerLine} ${isDrawerOpen ? styles.hamburgerLineActive : ""}`}></span>
              <span className={`${styles.hamburgerLine} ${isDrawerOpen ? styles.hamburgerLineActive : ""}`}></span>
            </button>
          )}
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobile && isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
            />

            {/* Drawer */}
            <motion.div
              className={styles.drawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className={styles.drawerHeader}>
                <button className={styles.closeButton} onClick={closeDrawer} aria-label="Close menu">
                  ✕
                </button>
              </div>

              {user && (
                <>
                  {/* User Profile in Drawer */}
                  <div className={styles.drawerUserProfile}>
                    <div className={styles.drawerProfileImageContainer}>
                      <Image
                        src={user.profileImageUrl || "/images/no-photo.png"}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={60}
                        height={60}
                        className={styles.drawerProfileImage}
                      />
                    </div>
                    <div className={styles.drawerUserInfo}>
                      <span className={styles.drawerUserName}>
                        {user.firstName} {user.lastName}
                      </span>
                      <span className={styles.drawerUserRole}>{user.role}</span>
                    </div>
                  </div>

                  {/* Navigation Links in Drawer */}
                  <nav className={styles.drawerNavigation}>
                    <ul className={styles.drawerNavList}>
                      {navigationLinks.map((link) => (
                        <li key={link.href} className={styles.drawerNavItem}>
                          <Link href={link.href} className={styles.drawerNavLink} onClick={closeDrawer}>
                            <span className={styles.drawerNavIcon}>{link.icon}</span>
                            <span className={styles.drawerNavLabel}>{link.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Logout Button in Drawer */}
                  <div className={styles.drawerFooter}>
                    <motion.button
                      className={styles.drawerLogoutButton}
                      onClick={handleLogout}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Logout
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
