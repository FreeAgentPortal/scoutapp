export interface PhotoUploadProps {
  default?: string;
  label?: string;
  name?: string;
  action?: string;
  placeholder?: string;
  tooltip?: string;
  isAvatar?: boolean;
  imgStyle?: React.CSSProperties;
  form?: {
    setFieldValue: (name: string, value: any) => void;
    getFieldValue?: (name: string) => any;
  };
  aspectRatio?: number;
  bodyData?: any;
  dark?: boolean;
  disabled?: boolean;
  onImageChange?: (imageUrl: string) => void;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropperState {
  showCropper: boolean;
  originalImage: string | null;
  cropArea: CropArea;
  isDragging: boolean;
  dragStart: { x: number; y: number };
}

export interface CropperRefs {
  imageRef: React.RefObject<HTMLImageElement | null>;
  cropperRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export interface CropperHandlers {
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: () => void;
  cropImage: () => Promise<string>;
  handleCropConfirm: () => Promise<void>;
  handleCropCancel: () => void;
}

export interface UploadHandlers {
  validateFile: (file: File) => boolean;
  handleFileSelect: (file: File) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadImage: (imageBlob: Blob) => Promise<void>;
}
