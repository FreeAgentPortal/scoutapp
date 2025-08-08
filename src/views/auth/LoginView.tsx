"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useApiHook from "@/hooks/useApi";
import styles from "./LoginView.module.scss";
import AlertCenter from "@/layout/alertCenter/AlertCenter.layout";

const LoginView: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useApiHook({
    method: "POST",
    url: "/auth/login",
    key: "login",
    successMessage: "Login successful! Welcome back.",
    onSuccessCallback: (data) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
        window.location.reload();
      }
    },
    onErrorCallback: (error) => {},
  }) as any; // Type assertion needed for mutation

  const handleInitialLogin = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      loginMutation.mutate({
        formData: {
          email,
          password,
        },
      });
    }
  };

  const handleBackToStart = () => {
    setShowForm(false);
    setEmail("");
    setPassword("");
  };

  // Check for token in URL params (after redirect from auth server)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // Remove token from URL and reload
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
    }
  }, []);

  const isLoading = loginMutation.isPending;

  return (
    <div className={styles.container}>
      <AlertCenter />
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={styles.header}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className={styles.logo}>🏈</div>
          <h1 className={styles.title}>Welcome to FAP</h1>
          <p className={styles.subtitle}>Free Agent Portal - Scout Platform</p>
        </motion.div>

        <motion.div
          className={styles.loginSection}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className={styles.loginTitle}>Scout Dashboard</h2>
                <p className={styles.description}>
                  Access your scouting tools to search athletes and generate detailed scout reports.
                </p>

                <motion.button
                  className={styles.loginButton}
                  onClick={handleInitialLogin}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Login to Continue
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.formHeader}>
                  <motion.button
                    className={styles.backButton}
                    onClick={handleBackToStart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ← Back
                  </motion.button>
                  <h2 className={styles.loginTitle}>Sign In</h2>
                </div>

                <form onSubmit={handleFormSubmit} className={styles.loginForm}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.input}
                      placeholder="scout@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={styles.input}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className={styles.loginButton}
                    disabled={isLoading || !email || !password}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {isLoading ? (
                      <motion.div
                        className={styles.spinner}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      "Sign In"
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className={styles.features}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>🔍</span>
            <span>Search Athletes</span>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>📊</span>
            <span>Generate Reports</span>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}>📱</span>
            <span>Mobile First</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginView;
