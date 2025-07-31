"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import formStyles from "@/styles/Form.module.scss";
import { IScoutReport } from "@/types/IScoutReport";
import { IAthlete } from "@/types/IAthlete";
import { SPORTS_DATA } from "@/data/sports.data";
import { LEAGUES_DATA } from "@/data/leagues.data";
import AttributeModal from "./AttributeModal.component";
import AttributeCard from "./AttributeCard.component";

interface ReportFormProps {
  athleteId: string;
  athlete?: IAthlete; // Optional for now to avoid breaking changes
  onSubmit: (formData: Partial<IScoutReport>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

type FormData = {
  sport: string;
  league: string;
  reportType: "game" | "evaluation" | "camp" | "combine" | "interview" | "other";
  ratingBreakdown: Record<string, { score: number; comments?: string }>;
  observations: string;
  strengths: string[];
  weaknesses: string[];
  verifiedMetrics: string[];
  tags: string[];
  isPublic: boolean;
  isDraft: boolean;
};

const ReportForm: React.FC<ReportFormProps> = ({ athleteId, athlete, onSubmit, onCancel, isSubmitting = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStrength, setNewStrength] = useState("");
  const [newWeakness, setNewWeakness] = useState("");
  const [newTag, setNewTag] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      sport: "American Football",
      league: "National Football League (NFL)",
      reportType: "evaluation",
      ratingBreakdown: {},
      observations: "",
      strengths: [],
      weaknesses: [],
      verifiedMetrics: [],
      tags: [],
      isPublic: false, // Default to private for privacy
      isDraft: true, // Default to draft until scout is ready
    },
  });

  // Watch the current ratings to track what's been added
  const currentRatings = watch("ratingBreakdown") || {};
  const selectedAttributes = Object.keys(currentRatings);
  const currentStrengths = watch("strengths") || [];
  const currentWeaknesses = watch("weaknesses") || [];
  const currentVerifiedMetrics = watch("verifiedMetrics") || [];
  const currentTags = watch("tags") || [];

  const addRatingAttribute = (attribute: string, score: number, comments?: string) => {
    setValue(`ratingBreakdown.${attribute}`, { score, comments: comments || "" });
  };

  const removeRatingAttribute = (attribute: string) => {
    const newRatings = { ...currentRatings };
    delete newRatings[attribute];
    setValue("ratingBreakdown", newRatings);
  };

  const addStrength = () => {
    if (newStrength.trim()) {
      setValue("strengths", [...currentStrengths, newStrength.trim()]);
      setNewStrength("");
    }
  };

  const removeStrength = (index: number) => {
    const updated = currentStrengths.filter((_, i) => i !== index);
    setValue("strengths", updated);
  };

  const addWeakness = () => {
    if (newWeakness.trim()) {
      setValue("weaknesses", [...currentWeaknesses, newWeakness.trim()]);
      setNewWeakness("");
    }
  };

  const removeWeakness = (index: number) => {
    const updated = currentWeaknesses.filter((_, i) => i !== index);
    setValue("weaknesses", updated);
  };

  const toggleVerifiedMetric = (metricName: string) => {
    const isCurrentlyVerified = currentVerifiedMetrics.includes(metricName);
    if (isCurrentlyVerified) {
      // Remove from verified metrics
      setValue(
        "verifiedMetrics",
        currentVerifiedMetrics.filter((m) => m !== metricName)
      );
    } else {
      // Add to verified metrics
      setValue("verifiedMetrics", [...currentVerifiedMetrics, metricName]);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      setValue("tags", [...currentTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    const updated = currentTags.filter((_, i) => i !== index);
    setValue("tags", updated);
  };

  const reportTypes = [
    { value: "game", label: "Game Report" },
    { value: "evaluation", label: "Evaluation" },
    { value: "camp", label: "Camp Report" },
    { value: "combine", label: "Combine Report" },
    { value: "interview", label: "Interview" },
    { value: "other", label: "Other" },
  ];

  const onFormSubmit = (data: FormData) => {
    // Validate minimum 3 attributes
    const ratingCount = Object.keys(data.ratingBreakdown || {}).length;
    if (ratingCount < 3) {
      alert("Please select and rate at least 3 attributes for a comprehensive evaluation.");
      return;
    }

    const formData = {
      ...data,
      athleteId,
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={formStyles.form}>
      {/* Basic Information */}
      <div className={formStyles.formSection}>
        <h3 className={formStyles.sectionTitle}>Basic Information</h3>

        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label}>Sport *</label>
            <select
              {...register("sport", {
                required: "Sport is required",
              })}
              className={formStyles.input}
            >
              {SPORTS_DATA.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
            {errors.sport && <div className={formStyles.error}>{errors.sport.message}</div>}
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.label}>League *</label>
            <select
              {...register("league", {
                required: "League is required",
              })}
              className={formStyles.input}
            >
              {LEAGUES_DATA.map((league) => (
                <option key={league} value={league}>
                  {league}
                </option>
              ))}
            </select>
            {errors.league && <div className={formStyles.error}>{errors.league.message}</div>}
          </div>
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>Report Type *</label>
          <select {...register("reportType", { required: "Report type is required" })} className={formStyles.input}>
            {reportTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.reportType && <div className={formStyles.error}>{errors.reportType.message}</div>}
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className={formStyles.formSection}>
        <h3 className={formStyles.sectionTitle}>Player Evaluation</h3>
        <p style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
          Select at least 3 attributes to evaluate. Rate each on a scale of 1-5.
        </p>

        {/* Add Attribute Button */}
        <div style={{ marginBottom: "1.5rem" }}>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={formStyles.submit}
            style={{
              backgroundColor: "var(--primary, #1e40af)",
              fontSize: "0.875rem",
              padding: "0.75rem 1rem",
            }}
          >
            + Add Player Evaluation
          </button>
        </div>

        {/* Selected Attributes */}
        {selectedAttributes.length > 0 && (
          <div>
            <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: "600" }}>
              Selected Evaluations ({selectedAttributes.length})
            </h4>

            {selectedAttributes.map((attribute) => {
              const rating = currentRatings[attribute];
              return (
                <AttributeCard
                  key={attribute}
                  attribute={attribute}
                  score={rating?.score || 0}
                  comments={rating?.comments}
                  onRemove={() => removeRatingAttribute(attribute)}
                />
              );
            })}
          </div>
        )}

        {/* Validation Message */}
        {selectedAttributes.length < 3 && (
          <div
            style={{
              padding: "0.75rem",
              backgroundColor: "rgba(255, 193, 7, 0.1)",
              border: "1px solid var(--color-warning, #ffc107)",
              borderRadius: "6px",
              fontSize: "0.875rem",
              color: "var(--color-warning-dark, #856404)",
            }}
          >
            ⚠️ Please select at least 3 attributes to evaluate for a comprehensive assessment.
          </div>
        )}
      </div>

      {/* Observations Section */}
      <div className={formStyles.formSection}>
        <h3 className={formStyles.sectionTitle}>Observations</h3>
        <p style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
          General commentary and notes about the player&apos;s performance or character.
        </p>

        <div className={formStyles.field}>
          <label className={formStyles.label}>General Observations</label>
          <textarea
            {...register("observations")}
            className={formStyles.textarea}
            rows={4}
            placeholder="Share your general observations about this player..."
          />
        </div>
      </div>

      {/* Strengths Section */}
      <div className={formStyles.formSection}>
        <h3 className={formStyles.sectionTitle}>Strengths</h3>
        <p style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
          Key strengths and positive attributes you&apos;ve observed.
        </p>

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            <div className={formStyles.field} style={{ flex: 1, margin: 0 }}>
              <label className={formStyles.label}>Add Strength</label>
              <input
                type="text"
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                className={formStyles.input}
                placeholder="Enter a strength..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addStrength();
                  }
                }}
              />
            </div>
            <button
              type="button"
              onClick={addStrength}
              className={formStyles.submit}
              style={{
                fontSize: "0.875rem",
                padding: "0.75rem 1rem",
                height: "fit-content",
              }}
            >
              Add
            </button>
          </div>
        </div>

        {currentStrengths.length > 0 && (
          <div>
            <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: "600" }}>
              Identified Strengths ({currentStrengths.length})
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {currentStrengths.map((strength, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    borderRadius: "6px",
                  }}
                >
                  <span style={{ color: "var(--text-primary, white)" }}>{strength}</span>
                  <button
                    type="button"
                    onClick={() => removeStrength(index)}
                    style={{
                      padding: "0.25rem 0.5rem",
                      background: "var(--error-color, #dc3545)",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Weaknesses Section */}
      <div className={formStyles.formSection}>
        <h3 className={formStyles.sectionTitle}>Weaknesses</h3>
        <p style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
          Areas for improvement and development opportunities.
        </p>

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            <div className={formStyles.field} style={{ flex: 1, margin: 0 }}>
              <label className={formStyles.label}>Add Weakness</label>
              <input
                type="text"
                value={newWeakness}
                onChange={(e) => setNewWeakness(e.target.value)}
                className={formStyles.input}
                placeholder="Enter an area for improvement..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addWeakness();
                  }
                }}
              />
            </div>
            <button
              type="button"
              onClick={addWeakness}
              className={formStyles.submit}
              style={{
                fontSize: "0.875rem",
                padding: "0.75rem 1rem",
                height: "fit-content",
              }}
            >
              Add
            </button>
          </div>
        </div>

        {currentWeaknesses.length > 0 && (
          <div>
            <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: "600" }}>
              Areas for Improvement ({currentWeaknesses.length})
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {currentWeaknesses.map((weakness, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "6px",
                  }}
                >
                  <span style={{ color: "var(--text-primary, white)" }}>{weakness}</span>
                  <button
                    type="button"
                    onClick={() => removeWeakness(index)}
                    style={{
                      padding: "0.25rem 0.5rem",
                      background: "var(--error-color, #dc3545)",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Verified Metrics Section */}
      <div className={formStyles.formSection}>
        <h3 className={formStyles.sectionTitle}>Verified Metrics</h3>
        <p style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
          Select metrics that you were able to verify during your evaluation. Only check metrics you personally
          witnessed or tested.
        </p>

        {athlete?.metrics && Object.keys(athlete.metrics).length > 0 ? (
          <div>
            <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: "600" }}>
              Athlete&apos;s Claimed Metrics
            </h4>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0.75rem" }}
            >
              {Object.entries(athlete.metrics).map(([metricName, metricValue]) => {
                const isVerified = currentVerifiedMetrics.includes(metricName);
                return (
                  <div
                    key={metricName}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem",
                      backgroundColor: isVerified ? "rgba(34, 197, 94, 0.1)" : "rgba(255, 255, 255, 0.05)",
                      border: isVerified ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => toggleVerifiedMetric(metricName)}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "var(--text-primary, white)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {metricName.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </div>
                      <div
                        style={{
                          fontSize: "1.125rem",
                          color: "var(--primary-light, #b3e6fc)",
                          fontWeight: "700",
                        }}
                      >
                        {typeof metricValue === "number" ? metricValue.toFixed(2) : metricValue}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {isVerified && (
                        <span
                          style={{
                            fontSize: "0.875rem",
                            color: "rgba(34, 197, 94, 0.8)",
                            fontWeight: "600",
                          }}
                        >
                          ✓ Verified
                        </span>
                      )}
                      <input
                        type="checkbox"
                        checked={isVerified}
                        onChange={() => toggleVerifiedMetric(metricName)}
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {currentVerifiedMetrics.length > 0 && (
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "6px",
                }}
              >
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: "600" }}>
                  Verified Metrics Summary ({currentVerifiedMetrics.length})
                </h4>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary, #ccc)" }}>
                  You are certifying that you personally witnessed or tested: {currentVerifiedMetrics.join(", ")}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "var(--text-secondary, #ccc)",
            }}
          >
            <p style={{ margin: 0, fontSize: "1rem" }}>No metrics available for this athlete.</p>
            <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>
              The athlete hasn&apos;t provided any performance metrics to verify.
            </p>
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div className={formStyles.formSection}>
        <h3 className={formStyles.sectionTitle}>Tags</h3>
        <p style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
          Add tags to help organize and categorize your reports. Optional but helpful for filtering.
        </p>

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            <div className={formStyles.field} style={{ flex: 1, margin: 0 }}>
              <label className={formStyles.label}>Add Tag</label>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className={formStyles.input}
                placeholder="Enter a tag (e.g., 'standout', 'potential', 'injury-prone')..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
            </div>
            <button
              type="button"
              onClick={addTag}
              className={formStyles.submit}
              style={{
                fontSize: "0.875rem",
                padding: "0.75rem 1rem",
                height: "fit-content",
              }}
            >
              Add
            </button>
          </div>
        </div>

        {currentTags.length > 0 && (
          <div>
            <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: "600" }}>
              Report Tags ({currentTags.length})
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {currentTags.map((tag, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.75rem",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "20px",
                    fontSize: "0.875rem",
                  }}
                >
                  <span style={{ color: "var(--text-primary, white)" }}>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--error-color, #dc3545)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Report Settings Section */}
      <div className={formStyles.formSection}>
        <h3 className={formStyles.sectionTitle}>Report Settings</h3>
        <p style={{ marginBottom: "1.5rem", color: "var(--color-text-secondary)" }}>
          Configure visibility and completion status for this report.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Public/Private Toggle */}
          <div className={formStyles.field}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  {...register("isPublic")}
                  id="isPublic"
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    cursor: "pointer",
                  }}
                />
                <label htmlFor="isPublic" className={formStyles.label} style={{ margin: 0, cursor: "pointer" }}>
                  Make Report Public
                </label>
              </div>
            </div>
            <div
              style={{
                marginTop: "0.5rem",
                fontSize: "0.875rem",
                color: "var(--text-secondary, #ccc)",
                paddingLeft: "1.75rem",
              }}
            >
              When public, teams can view the detailed evaluation. When private, teams only see the diamond rating and
              basic info.
            </div>
          </div>

          {/* Draft/Final Toggle */}
          <div className={formStyles.field}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  {...register("isDraft")}
                  id="isDraft"
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    cursor: "pointer",
                  }}
                />
                <label htmlFor="isDraft" className={formStyles.label} style={{ margin: 0, cursor: "pointer" }}>
                  Save as Draft
                </label>
              </div>
            </div>
            <div
              style={{
                marginTop: "0.5rem",
                fontSize: "0.875rem",
                color: "var(--text-secondary, #ccc)",
                paddingLeft: "1.75rem",
              }}
            >
              Draft reports won&apos;t affect the player&apos;s overall rating until finalized. Uncheck when you&apos;re
              ready to submit.
            </div>
          </div>

          {/* Settings Summary */}
          <div
            style={{
              padding: "1rem",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              fontSize: "0.875rem",
            }}
          >
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: "600" }}>Report Status Summary</h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.25rem", color: "var(--text-secondary, #ccc)" }}
            >
              <div>
                <strong>Visibility:</strong>{" "}
                {watch("isPublic")
                  ? "Public (teams can see detailed evaluation)"
                  : "Private (teams see only diamond rating)"}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                {watch("isDraft") ? "Draft (won't affect player rating)" : "Final (will contribute to player score)"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attribute Modal */}
      <AttributeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addRatingAttribute}
        selectedAttributes={selectedAttributes}
      />

      {/* Form Actions */}
      <div className={formStyles.actions}>
        <button type="button" onClick={onCancel} className={formStyles.cancelButton} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className={formStyles.submit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </form>
  );
};

export default ReportForm;
