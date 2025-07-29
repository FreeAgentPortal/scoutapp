import { useCallback, useEffect } from "react";
import { CropArea, CropperState, CropperRefs, CropperHandlers } from "./PhotoUpload.types";

export const useCropper = (
  cropperState: CropperState,
  setCropperState: React.Dispatch<React.SetStateAction<CropperState>>,
  refs: CropperRefs,
  uploadImage: (blob: Blob) => Promise<void>,
  fileInputRef: React.RefObject<HTMLInputElement | null>
): CropperHandlers => {
  const { isDragging, dragStart, cropArea, showCropper } = cropperState;
  const { imageRef, cropperRef, canvasRef } = refs;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setCropperState((prev) => ({
        ...prev,
        isDragging: true,
        dragStart: { x: e.clientX, y: e.clientY },
      }));
    },
    [setCropperState]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !imageRef.current || !cropperRef.current) return;

      const imgRect = imageRef.current.getBoundingClientRect();

      const scaleX = imageRef.current.naturalWidth / imgRect.width;
      const scaleY = imageRef.current.naturalHeight / imgRect.height;

      const deltaX = (e.clientX - dragStart.x) * scaleX;
      const deltaY = (e.clientY - dragStart.y) * scaleY;

      setCropperState((prev) => {
        const newX = Math.max(
          0,
          Math.min(prev.cropArea.x + deltaX, imageRef.current!.naturalWidth - prev.cropArea.width)
        );
        const newY = Math.max(
          0,
          Math.min(prev.cropArea.y + deltaY, imageRef.current!.naturalHeight - prev.cropArea.height)
        );

        return {
          ...prev,
          cropArea: { ...prev.cropArea, x: newX, y: newY },
          dragStart: { x: e.clientX, y: e.clientY },
        };
      });
    },
    [isDragging, dragStart, imageRef, cropperRef, setCropperState]
  );

  const handleMouseUp = useCallback(() => {
    setCropperState((prev) => ({ ...prev, isDragging: false }));
  }, [setCropperState]);

  const cropImage = useCallback(async (): Promise<string> => {
    return new Promise((resolve) => {
      if (!imageRef.current || !canvasRef.current) {
        resolve("");
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imageRef.current;

      if (!ctx) {
        resolve("");
        return;
      }

      // Set canvas size to crop area
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      // Draw cropped image
      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            resolve("");
          }
        },
        "image/jpeg",
        0.9
      );
    });
  }, [cropArea, imageRef, canvasRef]);

  const handleCropConfirm = useCallback(async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            await uploadImage(blob);
            setCropperState((prev) => ({
              ...prev,
              showCropper: false,
              originalImage: null,
            }));
          }
        },
        "image/jpeg",
        0.9
      );
    }
  }, [canvasRef, uploadImage, setCropperState]);

  const handleCropCancel = useCallback(() => {
    setCropperState((prev) => ({
      ...prev,
      showCropper: false,
      originalImage: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [setCropperState, fileInputRef]);

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cropImage,
    handleCropConfirm,
    handleCropCancel,
  };
};

export const initializeCropArea = (
  imageElement: HTMLImageElement,
  isAvatar: boolean,
  aspectRatio: number
): CropArea => {
  const imgAspect = imageElement.naturalWidth / imageElement.naturalHeight;
  const targetAspect = isAvatar ? 1 : aspectRatio;

  let cropWidth, cropHeight;
  if (imgAspect > targetAspect) {
    cropHeight = imageElement.naturalHeight * 0.8;
    cropWidth = cropHeight * targetAspect;
  } else {
    cropWidth = imageElement.naturalWidth * 0.8;
    cropHeight = cropWidth / targetAspect;
  }

  return {
    x: (imageElement.naturalWidth - cropWidth) / 2,
    y: (imageElement.naturalHeight - cropHeight) / 2,
    width: cropWidth,
    height: cropHeight,
  };
};
