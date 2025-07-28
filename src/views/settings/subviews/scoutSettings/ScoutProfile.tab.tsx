"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useApi from "@/hooks/useApi";
import { IScoutProfile } from "@/types/IScoutProfile";
import styles from "./ScoutProfile.module.scss";
import { useAuth } from "@/layout/authProvider/AuthProvider.layout";

interface ScoutProfileTabProps {}

const ScoutProfile: React.FC<ScoutProfileTabProps> = () => {
  const { user } = useAuth();
  // Fetch scout profile
  const { data, isLoading } = useApi({
    method: "GET",
    key: ["profile", "scout"],
    url: `/scout/profile/${user?.profileRefs["scout"]}`,
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
  const [newTeam, setNewTeam] = useState("");
  const [newSport, setNewSport] = useState("");
  const [newLeague, setNewLeague] = useState("");

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

  const updateScoutMutation = useApi({
    method: "PUT",
    url: `/scout/profile/${scoutProfile?.id}`,
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

  const handleAddItem = (type: "teams" | "sports" | "leagues", value: string) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [type]: [...prev[type], value.trim()],
      }));

      if (type === "teams") setNewTeam("");
      if (type === "sports") setNewSport("");
      if (type === "leagues") setNewLeague("");
    }
  };

  const handleRemoveItem = (type: "teams" | "sports" | "leagues", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateScoutMutation.mutate({ formData });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating scout profile:", error);
    }
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
        <p>You don't have a scout profile associated with your account.</p>
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
        className={styles.form}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Professional Information</h3>

          <div className={styles.formGroup}>
            <label htmlFor="displayName" className={styles.label}>
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`${styles.input} ${!isEditing ? styles.inputDisabled : ""}`}
              placeholder="Your professional name"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="contactNumber" className={styles.label}>
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`${styles.input} ${!isEditing ? styles.inputDisabled : ""}`}
                placeholder="Professional contact"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Professional Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`${styles.input} ${!isEditing ? styles.inputDisabled : ""}`}
                placeholder="scout@example.com"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bio" className={styles.label}>
              Biography
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`${styles.textarea} ${!isEditing ? styles.inputDisabled : ""}`}
              placeholder="Tell others about your scouting experience and expertise..."
              rows={4}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Specializations</h3>

          {/* Sports */}
          <div className={styles.arrayField}>
            <label className={styles.label}>Sports</label>
            <div className={styles.tagContainer}>
              {formData.sports.map((sport, index) => (
                <motion.span
                  key={index}
                  className={styles.tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {sport}
                  {isEditing && (
                    <button
                      type="button"
                      className={styles.tagRemove}
                      onClick={() => handleRemoveItem("sports", index)}
                    >
                      ×
                    </button>
                  )}
                </motion.span>
              ))}
            </div>
            {isEditing && (
              <div className={styles.addField}>
                <input
                  type="text"
                  value={newSport}
                  onChange={(e) => setNewSport(e.target.value)}
                  placeholder="Add a sport"
                  className={styles.addInput}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddItem("sports", newSport);
                    }
                  }}
                />
                <button type="button" onClick={() => handleAddItem("sports", newSport)} className={styles.addButton}>
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Teams */}
          <div className={styles.arrayField}>
            <label className={styles.label}>Teams</label>
            <div className={styles.tagContainer}>
              {formData.teams.map((team, index) => (
                <motion.span
                  key={index}
                  className={styles.tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {team}
                  {isEditing && (
                    <button type="button" className={styles.tagRemove} onClick={() => handleRemoveItem("teams", index)}>
                      ×
                    </button>
                  )}
                </motion.span>
              ))}
            </div>
            {isEditing && (
              <div className={styles.addField}>
                <input
                  type="text"
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                  placeholder="Add a team"
                  className={styles.addInput}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddItem("teams", newTeam);
                    }
                  }}
                />
                <button type="button" onClick={() => handleAddItem("teams", newTeam)} className={styles.addButton}>
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Leagues */}
          <div className={styles.arrayField}>
            <label className={styles.label}>Leagues</label>
            <div className={styles.tagContainer}>
              {formData.leagues.map((league, index) => (
                <motion.span
                  key={index}
                  className={styles.tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {league}
                  {isEditing && (
                    <button
                      type="button"
                      className={styles.tagRemove}
                      onClick={() => handleRemoveItem("leagues", index)}
                    >
                      ×
                    </button>
                  )}
                </motion.span>
              ))}
            </div>
            {isEditing && (
              <div className={styles.addField}>
                <input
                  type="text"
                  value={newLeague}
                  onChange={(e) => setNewLeague(e.target.value)}
                  placeholder="Add a league"
                  className={styles.addInput}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddItem("leagues", newLeague);
                    }
                  }}
                />
                <button type="button" onClick={() => handleAddItem("leagues", newLeague)} className={styles.addButton}>
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Profile Status</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Profile ID:</span>
              <span className={styles.infoValue}>{scoutProfile.id}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Status:</span>
              <span
                className={`${styles.infoValue} ${scoutProfile.isActive ? styles.statusActive : styles.statusInactive}`}
              >
                {scoutProfile.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Created:</span>
              <span className={styles.infoValue}>{new Date(scoutProfile.createdAt).toLocaleDateString()}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Last Updated:</span>
              <span className={styles.infoValue}>{new Date(scoutProfile.updatedAt).toLocaleDateString()}</span>
            </div>
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
              Edit Scout Profile
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
