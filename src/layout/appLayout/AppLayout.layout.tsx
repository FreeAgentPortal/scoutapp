"use client";

import React from "react";
import Navbar from "@/layout/navbar/Navbar.layout";
import Footer from "@/layout/footer/Footer.layout";
import ScoutWrapper from "@/layout/scoutWrapper/ScoutWrapper.layout";
import styles from "./AppLayout.module.scss";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ScoutWrapper>
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </ScoutWrapper>
  );
};

export default AppLayout;
