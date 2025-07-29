"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./UserProfile.module.scss";
import formStyles from "@/styles/Form.module.scss";
import useApiHook from "@/hooks/useApi";
import { useUser } from "@/state/auth";
import { PhotoUpload } from "@/components/photoUpload";
import { useInterfaceStore } from "@/state/interface";

const UserProfile: React.FC<any> = () => {
  const { data: loggedInUser, refetch } = useUser();
  const { addAlert } = useInterfaceStore((state) => state);

  // Create a simple form object to satisfy PhotoUpload component requirements
  const mockForm = {
    setFieldValue: (name: string, value: any) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    getFieldValue: (name: string) => formData[name as keyof typeof formData],
    setFieldsValue: (values: any) => {
      setFormData((prev) => ({ ...prev, ...values }));
    },
  };

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
    profileImageUrl: data?.payload?.profileImageUrl || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const { mutate: updateUserMutation } = useApiHook({
    method: "PUT",
    key: ["user"],
    successMessage: "User profile updated successfully!",
    queriesToInvalidate: [`user,${loggedInUser?._id}`],
  }) as any;

  // Update password
  const { mutate: updatePassword, isPending: isUpdatingPassword } = useApiHook({
    method: "PUT",
    url: `/user/${loggedInUser?._id}/password`,
    key: "user-password-update",
  }) as any;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
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
      profileImageUrl: data?.payload?.profileImageUrl || "",
    });
    setIsEditing(false);
  };

  React.useEffect(() => {
    if (data) {
      const userData = {
        firstName: data.payload.firstName || "",
        lastName: data.payload.lastName || "",
        email: data.payload.email || "",
        phoneNumber: data.payload.phoneNumber || "",
        profileImageUrl: data.payload.profileImageUrl || "",
      };
      setFormData(userData);
    }
  }, [data]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addAlert({
        type: "error",
        message: "New passwords do not match",
        duration: 5000,
      });
      return;
    }

    updatePassword(
      {
        formData: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
      },
      {
        onSuccess: () => {
          addAlert({
            type: "success",
            message: "Password updated successfully",
            duration: 3000,
          });
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        },
        onError: (error: any) => {
          addAlert({
            type: "error",
            message: error?.response?.data?.message || "Failed to update password",
            duration: 5000,
          });
        },
      }
    );
  };

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
          <h3 className={formStyles.sectionTitle}>Profile Picture</h3>

          <div className={styles.imageContainer}>
            <PhotoUpload
              default={data?.payload?.profileImageUrl}
              name="profileImageUrl"
              action={`${process.env.NEXT_PUBLIC_API_URL}/upload/cloudinary/file`}
              isAvatar={true}
              form={mockForm}
              aspectRatio={1}
              placeholder="Upload your profile photo"
              imgStyle={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
              }}
            />
          </div>
        </div>

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

      {/* Password Change Section */}
      <motion.div
        className={formStyles.form}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className={formStyles.formSection}>
          <h3 className={formStyles.sectionTitle}>Change Password</h3>

          <form onSubmit={handlePasswordSubmit}>
            <div className={`${formStyles.formRow} ${formStyles.grid}`}>
              <div className={formStyles.formGroup}>
                <label htmlFor="currentPassword" className={formStyles.label}>
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  className={formStyles.input}
                  placeholder="Enter your current password"
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>

            <div className={`${formStyles.formRow} ${formStyles.grid}`}>
              <div className={formStyles.formGroup}>
                <label htmlFor="newPassword" className={formStyles.label}>
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  className={formStyles.input}
                  placeholder="Enter your new password"
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className={formStyles.formGroup}>
                <label htmlFor="confirmPassword" className={formStyles.label}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  className={formStyles.input}
                  placeholder="Confirm your new password"
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>

            <div className={formStyles.actions}>
              <motion.button
                type="submit"
                className={formStyles.saveButton}
                disabled={isUpdatingPassword}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
