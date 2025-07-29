"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Loader from "../loader/Loader.component";
import CropperModal from "./CropperModal.component";
import { useCropper } from "./PhotoUpload.utils";
import { useUploadHandlers } from "./PhotoUpload.hooks";
import { PhotoUploadProps, CropperState } from "./PhotoUpload.types";
import styles from "./PhotoUpload.module.scss";

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  default: defaultImage,
  label,
  name = "image",
  action,
  placeholder = "Upload an Image",
  tooltip,
  isAvatar = false,
  imgStyle,
  form,
  aspectRatio = 16 / 9,
  bodyData,
  dark = false,
  disabled = false,
  onImageChange,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(defaultImage);
  const [cropperState, setCropperState] = useState<CropperState>({
    showCropper: false,
    originalImage: null,
    cropArea: { x: 0, y: 0, width: 100, height: 100 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const refs = { imageRef, cropperRef, canvasRef };

  useEffect(() => {
    if (defaultImage) {
      setImageUrl(defaultImage);
    }
  }, [defaultImage]);

  // Upload handlers
  const uploadHandlers = useUploadHandlers(
    { ...props, name, form, onImageChange, action, bodyData, aspectRatio, isAvatar },
    setLoading,
    setImageUrl,
    setCropperState,
    imageRef
  );

  // Cropper handlers
  const cropperHandlers = useCropper(cropperState, setCropperState, refs, uploadHandlers.uploadImage, fileInputRef);

  return (
    <div className={styles.photoUpload}>
      {label && (
        <label className={styles.label}>
          {label}
          {tooltip && (
            <span className={styles.tooltip} title={tooltip}>
              ?
            </span>
          )}
        </label>
      )}

      <div
        className={`${styles.uploadArea} ${cropperState.isDragging ? styles.dragging : ""} ${
          disabled ? styles.disabled : ""
        }`}
        onDrop={uploadHandlers.handleDrop}
        onDragOver={uploadHandlers.handleDragOver}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        {loading ? (
          <Loader />
        ) : imageUrl ? (
          <div className={styles.imagePreview}>
            {isAvatar ? (
              <div className={styles.avatarContainer} style={imgStyle}>
                <Image src={imageUrl} alt="Profile" width={200} height={200} className={styles.avatar} />
              </div>
            ) : (
              <Image
                src={imageUrl}
                alt="Uploaded"
                width={200}
                height={200}
                style={imgStyle}
                className={styles.uploadedImage}
              />
            )}
            {!disabled && (
              <motion.div
                className={styles.imageOverlay}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span>Change Image</span>
              </motion.div>
            )}
          </div>
        ) : (
          <div className={styles.uploadPrompt} style={imgStyle}>
            <div className={styles.uploadIcon}>📸</div>
            <span>{placeholder}</span>
            <span className={styles.uploadHint}>Click to upload or drag and drop</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={uploadHandlers.handleFileInputChange}
        style={{ display: "none" }}
        disabled={disabled}
      />

      {/* Cropper Modal */}
      <AnimatePresence>
        <CropperModal cropperState={cropperState} refs={refs} handlers={cropperHandlers} isAvatar={isAvatar} />
      </AnimatePresence>

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default PhotoUpload;
