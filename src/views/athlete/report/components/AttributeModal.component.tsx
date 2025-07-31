"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import formStyles from "@/styles/Form.module.scss";
import { scoutEvaluationCategories } from "./scoutEvaluationCategories.data";

interface AttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (attribute: string, score: number, comments?: string) => void;
  selectedAttributes: string[];
}

type ModalFormData = {
  attribute: string;
  score: number;
  comments?: string;
};

const AttributeModal: React.FC<AttributeModalProps> = ({ isOpen, onClose, onAdd, selectedAttributes }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ModalFormData>({
    defaultValues: {
      attribute: "",
      score: 3,
      comments: "",
    },
  });

  const selectedAttribute = watch("attribute");

  const onSubmit = (data: ModalFormData) => {
    if (data.attribute && data.score) {
      onAdd(data.attribute, data.score, data.comments);
      reset();
      onClose();
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem", fontWeight: "600" }}>Add Player Evaluation</h3>

        <form onSubmit={handleSubmit(onSubmit)} className={formStyles.form} method="dialog">
          <div className={formStyles.field}>
            <label className={formStyles.label}>Select Attribute *</label>
            <select {...register("attribute", { required: "Please select an attribute" })} className={formStyles.input}>
              <option value="">Choose an attribute to evaluate...</option>
              {scoutEvaluationCategories.map((category) => (
                <optgroup key={category.category} label={category.category}>
                  {category.attributes
                    .filter((attr) => !selectedAttributes.includes(attr))
                    .map((attribute) => (
                      <option key={attribute} value={attribute}>
                        {attribute}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            {errors.attribute && <div className={formStyles.error}>{errors.attribute.message}</div>}
          </div>

          {selectedAttribute && (
            <>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Score (1-5) *</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.5"
                    {...register("score", {
                      required: "Score is required",
                      min: { value: 1, message: "Minimum score is 1" },
                      max: { value: 5, message: "Maximum score is 5" },
                    })}
                    className={formStyles.input}
                    style={{ width: "100px", textAlign: "center" }}
                  />
                  <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>/5</span>
                </div>
                {errors.score && <div className={formStyles.error}>{errors.score.message}</div>}
              </div>

              <div className={formStyles.field}>
                <label className={formStyles.label}>Comments (Optional)</label>
                <textarea
                  {...register("comments")}
                  className={formStyles.input}
                  placeholder="Add specific observations about this attribute..."
                  rows={3}
                />
              </div>
            </>
          )}

          <div className={formStyles.actions}>
            <button type="button" onClick={handleCancel} className={formStyles.cancelButton}>
              Cancel
            </button>
            <button
              type="submit"
              className={formStyles.submit}
              disabled={!selectedAttribute}
              onClick={handleSubmit(onSubmit)}
            >
              Add Evaluation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttributeModal;
