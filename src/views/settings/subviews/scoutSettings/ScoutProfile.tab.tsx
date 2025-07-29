"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./ScoutProfile.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { useAuth } from "@/layout/authProvider/AuthProvider.layout";
import MultiSelect from "@/components/multiSelect";
import { SPORTS_DATA } from "@/data/sports.data";
import { TEAMS_DATA } from "@/data/teams.data";
import { LEAGUES_DATA } from "@/data/leagues.data";
import useApiHook from "@/hooks/useApi";
import { useUser } from "@/state/auth";

const ScoutProfile: React.FC<any> = () => {
  const { data: user } = useUser();
  // Fetch scout profile
  const { data, isLoading } = useApiHook({
    method: "GET",
    key: ["profile", "scout"],
    url: `/profiles/scout/${user?.profileRefs["scout"]}`,
    enabled: !!user?.profileRefs["scout"],
  }) as any;

  const scoutProfile = data?.payload;
  const [formData, setFormData] = useState({
    displayName: "",
    contactNumber: "",
    email: "",
    bio: "",
    teams: [] as string[],
    sports: [] as string[],
    leagues: [] as string[],
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (scoutProfile) {
      setFormData({
        displayName: scoutProfile.displayName || "",
        contactNumber: scoutProfile.contactNumber || "",
        email: scoutProfile.email || "",
        bio: scoutProfile.bio || "",
        teams: scoutProfile.teams || [],
        sports: scoutProfile.sports || [],
        leagues: scoutProfile.leagues || [],
      });
    }
  }, [scoutProfile]);

  const { mutate: updateScoutMutation } = useApiHook({
    method: "PUT",
    key: ["profile", "scout"],
    successMessage: "Scout profile updated successfully!",
    queriesToInvalidate: ["profile,scout"],
  }) as any;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateScoutMutation(
      {
        url: `/profiles/scout/${scoutProfile?._id}`,
        formData,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          // Optionally refetch or update local state
        },
        onError: (error: any) => {
          console.error("Error updating scout profile:", error);
        },
      }
    );
  };

  const handleCancel = () => {
    if (scoutProfile) {
      setFormData({
        displayName: scoutProfile.displayName || "",
        contactNumber: scoutProfile.contactNumber || "",
        email: scoutProfile.email || "",
        bio: scoutProfile.bio || "",
        teams: scoutProfile.teams || [],
        sports: scoutProfile.sports || [],
        leagues: scoutProfile.leagues || [],
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingIcon}>🏈</div>
        <div>Loading scout profile...</div>
      </div>
    );
  }

  if (!scoutProfile) {
    return (
      <div className={styles.noProfile}>
        <div className={styles.noProfileIcon}>⚠️</div>
        <h3>No Scout Profile Found</h3>
        <p>You don&apos;t have a scout profile associated with your account.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Scout Profile</h2>
        <p className={styles.subtitle}>Manage your professional scouting information and specializations</p>
      </div>

      <motion.form
        className={formStyles.form}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className={formStyles.formSection}>
          <h3 className={formStyles.sectionTitle}>Professional Information</h3>

          <div className={formStyles.formGroup}>
            <label htmlFor="displayName" className={formStyles.label}>
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`${styles.input} ${!isEditing ? formStyles.inputDisabled : ""}`}
              placeholder="Your professional name"
            />
          </div>

          <div className={`${formStyles.formRow} ${formStyles.grid}`}>
            <div className={formStyles.formGroup}>
              <label htmlFor="contactNumber" className={formStyles.label}>
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`${styles.input} ${!isEditing ? formStyles.inputDisabled : ""}`}
                placeholder="Professional contact"
              />
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="email" className={formStyles.label}>
                Professional Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`${styles.input} ${!isEditing ? formStyles.inputDisabled : ""}`}
                placeholder="scout@example.com"
              />
            </div>
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="bio" className={formStyles.label}>
              Biography
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`${styles.textarea} ${!isEditing ? formStyles.inputDisabled : ""}`}
              placeholder="Tell others about your scouting experience and expertise..."
              rows={4}
            />
          </div>
        </div>

        <div className={formStyles.formSection}>
          <h3 className={formStyles.sectionTitle}>Specializations</h3>

          {/* Sports */}
          <MultiSelect
            label="Sports"
            options={SPORTS_DATA}
            selectedValues={formData.sports}
            onSelectionChange={(values: string[]) => setFormData({ ...formData, sports: values })}
            placeholder="Select sports you scout..."
            disabled={!isEditing}
          />

          {/* Teams */}
          <MultiSelect
            label="Teams"
            options={TEAMS_DATA}
            selectedValues={formData.teams}
            onSelectionChange={(values: string[]) => setFormData({ ...formData, teams: values })}
            placeholder="Select teams you follow..."
            disabled={!isEditing}
          />

          {/* Leagues */}
          <MultiSelect
            label="Leagues"
            options={LEAGUES_DATA}
            selectedValues={formData.leagues}
            onSelectionChange={(values: string[]) => setFormData({ ...formData, leagues: values })}
            placeholder="Select leagues you scout..."
            disabled={!isEditing}
          />
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
              Edit Scout Profile
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
                disabled={updateScoutMutation.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {updateScoutMutation.isPending ? "Saving..." : "Save Changes"}
              </motion.button>
            </div>
          )}
        </div>
      </motion.form>
    </div>
  );
};

export default ScoutProfile;
