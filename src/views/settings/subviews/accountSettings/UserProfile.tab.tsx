"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./UserProfile.module.scss";
import formStyles from "@/styles/Form.module.scss";
import useApiHook from "@/hooks/useApi";
import { useUser } from "@/state/auth";

const UserProfile: React.FC<any> = () => {
  const { data: loggedInUser, refetch } = useUser();
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

  const { mutate: updateUserMutation } = useApiHook({
    method: "PUT",
    key: ["user"],
    successMessage: "User profile updated successfully!",
    queriesToInvalidate: [`user,${loggedInUser?._id}`],
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
    await updateUserMutation(
      {
        url: `/user/${loggedInUser?._id}`,
        formData,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          refetch();
        },
        onError: (error: any) => {
          console.error("Error updating user profile:", error);
        },
      }
    );
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
        className={formStyles.form}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className={formStyles.formSection}>
          <h3 className={formStyles.sectionTitle}>Personal Information</h3>

          <div className={`${formStyles.formRow} ${formStyles.grid}`}>
            <div className={formStyles.formGroup}>
              <label htmlFor="firstName" className={formStyles.label}>
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`${formStyles.input} ${!isEditing ? formStyles.inputDisabled : ""}`}
                required
              />
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="lastName" className={formStyles.label}>
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`${formStyles.input} ${!isEditing ? formStyles.inputDisabled : ""}`}
                required
              />
            </div>
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="email" className={formStyles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`${formStyles.input} ${!isEditing ? formStyles.inputDisabled : ""}`}
              required
            />
            {data?.payload?.isEmailVerified ? (
              <span className={styles.verified}>✅ Verified</span>
            ) : (
              <span className={styles.unverified}>⚠️ Not verified</span>
            )}
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="phoneNumber" className={formStyles.label}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`${formStyles.input} ${!isEditing ? formStyles.inputDisabled : ""}`}
            />
          </div>
        </div>

        <div className={formStyles.actions}>
          {!isEditing ? (
            <motion.button
              type="button"
              className={formStyles.editButton}
              onClick={() => setIsEditing(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Edit Profile
            </motion.button>
          ) : (
            <div className={formStyles.editActions}>
              <motion.button
                type="button"
                className={formStyles.cancelButton}
                onClick={handleCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className={formStyles.saveButton}
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
