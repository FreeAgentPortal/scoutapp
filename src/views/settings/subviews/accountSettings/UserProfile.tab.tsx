"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import useApi from "@/hooks/useApi";
import IUser from "@/types/IUser";
import styles from "./UserProfile.module.scss";
import { useAuth } from "@/layout/authProvider/AuthProvider.layout";
import useApiHook from "@/hooks/useApi";

interface UserProfileTabProps {}

const UserProfile: React.FC<UserProfileTabProps> = () => {
  const { user: loggedInUser } = useAuth();
  const { data } = useApiHook({
    url: `/user/${loggedInUser?._id}`,
    key: ["user", loggedInUser?._id as string],
    method: "GET",
    enabled: !!loggedInUser?._id,
  });
  const [formData, setFormData] = useState({
    firstName: data?.payload?.firstName || "",
    lastName: data?.payload?.lastName || "",
    email: data?.payload?.email || "",
    phoneNumber: data?.payload?.phoneNumber || "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const updateUserMutation = useApi({
    method: "PUT",
    url: "/auth/profile",
    key: ["user"],
    successMessage: "User profile updated successfully!",
    queriesToInvalidate: ["user"],
  }) as any;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserMutation.mutate({ formData });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: data?.payload?.firstName || "",
      lastName: data?.payload?.lastName || "",
      email: data?.payload?.email || "",
      phoneNumber: data?.payload?.phoneNumber || "",
    });
    setIsEditing(false);
  };

  React.useEffect(() => {
    if (data) {
      setFormData({
        firstName: data.payload.firstName || "",
        lastName: data.payload.lastName || "",
        email: data.payload.email || "",
        phoneNumber: data.payload.phoneNumber || "",
      });
    }
  }, [data]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>User Profile</h2>
        <p className={styles.subtitle}>Manage your basic account information and contact details</p>
      </div>

      <motion.form
        className={styles.form}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Personal Information</h3>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.label}>
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`${styles.input} ${!isEditing ? styles.inputDisabled : ""}`}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.label}>
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`${styles.input} ${!isEditing ? styles.inputDisabled : ""}`}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`${styles.input} ${!isEditing ? styles.inputDisabled : ""}`}
              required
            />
            {data?.payload?.isEmailVerified ? (
              <span className={styles.verified}>✅ Verified</span>
            ) : (
              <span className={styles.unverified}>⚠️ Not verified</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber" className={styles.label}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`${styles.input} ${!isEditing ? styles.inputDisabled : ""}`}
            />
          </div>
        </div>

        <div className={styles.actions}>
          {!isEditing ? (
            <motion.button
              type="button"
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Edit Profile
            </motion.button>
          ) : (
            <div className={styles.editActions}>
              <motion.button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className={styles.saveButton}
                disabled={updateUserMutation.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
              </motion.button>
            </div>
          )}
        </div>
      </motion.form>
    </div>
  );
};

export default UserProfile;
