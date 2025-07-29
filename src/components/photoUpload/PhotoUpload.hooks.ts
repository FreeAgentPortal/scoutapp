import { useCallback } from "react";
import { useInterfaceStore } from "@/state/interface";
import { UploadHandlers, PhotoUploadProps, CropperState } from "./PhotoUpload.types";
import { initializeCropArea } from "./PhotoUpload.utils";

export const useUploadHandlers = (
  props: PhotoUploadProps,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>,
  setCropperState: React.Dispatch<React.SetStateAction<CropperState>>,
  imageRef: React.RefObject<HTMLImageElement | null>
): UploadHandlers => {
  const { addAlert } = useInterfaceStore((state) => state);
  const { name = "image", form, onImageChange, action, bodyData, aspectRatio = 16 / 9, isAvatar = false } = props;

  const validateFile = useCallback(
    (file: File): boolean => {
      const isValidType = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp";
      if (!isValidType) {
        addAlert({
          type: "error",
          message: "You can only upload JPG/PNG/WebP files",
          duration: 5000,
        });
        return false;
      }

      const isValidSize = file.size / 1024 / 1024 < 10;
      if (!isValidSize) {
        addAlert({
          type: "error",
          message: "Images must be smaller than 10MB",
          duration: 5000,
        });
        return false;
      }

      return true;
    },
    [addAlert]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!validateFile(file)) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCropperState((prev) => ({
          ...prev,
          originalImage: result,
          showCropper: true,
        }));

        // Initialize crop area based on aspect ratio
        setTimeout(() => {
          if (imageRef.current) {
            const cropArea = initializeCropArea(imageRef.current, isAvatar, aspectRatio);
            setCropperState((prev) => ({ ...prev, cropArea }));
          }
        }, 100);
      };
      reader.readAsDataURL(file);
    },
    [validateFile, setCropperState, imageRef, isAvatar, aspectRatio]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const uploadImage = useCallback(
    async (imageBlob: Blob) => {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", imageBlob, "image.jpg");

        // Add any additional body data
        if (bodyData) {
          Object.keys(bodyData).forEach((key) => {
            formData.append(key, bodyData[key]);
          });
        }

        const token = localStorage.getItem("token");
        const response = await fetch(action || `${process.env.NEXT_PUBLIC_API_URL}/upload/cloudinary`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result = await response.json();

        // Handle response structure
        let uploadedImageUrl = result.imageUrl;
        if (Array.isArray(result.payload)) {
          uploadedImageUrl = result.payload[0]?.url;
        }

        setImageUrl(uploadedImageUrl);

        // Update form if provided
        if (form?.setFieldValue) {
          form.setFieldValue(name, uploadedImageUrl);
        }

        // Call callback if provided
        if (onImageChange) {
          onImageChange(uploadedImageUrl);
        }

        addAlert({
          type: "success",
          message: "Image uploaded successfully",
          duration: 3000,
        });
      } catch (error) {
        console.error("Upload error:", error);
        addAlert({
          type: "error",
          message: "Failed to upload image",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    },
    [setLoading, action, bodyData, setImageUrl, form, name, onImageChange, addAlert]
  );

  return {
    validateFile,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleFileInputChange,
    uploadImage,
  };
};
