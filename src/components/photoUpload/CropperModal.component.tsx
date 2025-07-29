import React from "react";
import { motion } from "framer-motion";
import { CropperState, CropperRefs, CropperHandlers } from "./PhotoUpload.types";
import styles from "./PhotoUpload.module.scss";

interface CropperModalProps {
  cropperState: CropperState;
  refs: CropperRefs;
  handlers: CropperHandlers;
  isAvatar: boolean;
}

const CropperModal: React.FC<CropperModalProps> = ({ cropperState, refs, handlers, isAvatar }) => {
  const { showCropper, originalImage, cropArea } = cropperState;
  const { imageRef, cropperRef } = refs;
  const { handleMouseDown, handleCropConfirm, handleCropCancel } = handlers;

  if (!showCropper || !originalImage) return null;

  return (
    <motion.div className={styles.cropperModal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className={styles.cropperContainer}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className={styles.cropperHeader}>
          <h3>Crop Image</h3>
          <p>Drag to adjust the crop area</p>
        </div>

        <div className={styles.cropperWrapper} ref={cropperRef}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imageRef} src={originalImage} alt="Original" className={styles.cropperImage} />
          <div
            className={`${styles.cropOverlay} ${isAvatar ? styles.round : ""}`}
            style={{
              left: `${(cropArea.x / (imageRef.current?.naturalWidth || 1)) * 100}%`,
              top: `${(cropArea.y / (imageRef.current?.naturalHeight || 1)) * 100}%`,
              width: `${(cropArea.width / (imageRef.current?.naturalWidth || 1)) * 100}%`,
              height: `${(cropArea.height / (imageRef.current?.naturalHeight || 1)) * 100}%`,
            }}
            onMouseDown={handleMouseDown}
          />
        </div>

        <div className={styles.cropperActions}>
          <motion.button
            type="button"
            className={styles.cancelButton}
            onClick={handleCropCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="button"
            className={styles.confirmButton}
            onClick={handleCropConfirm}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Crop & Upload
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CropperModal;
