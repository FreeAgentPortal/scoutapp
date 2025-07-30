import { IAthlete } from "@/types/IAthlete";

export interface AthleteCardProps {
  /** The athlete data to display */
  athlete: IAthlete;
  /** Whether the card is in a loading state */
  loading?: boolean;
  /** Size variant of the card */
  size?: "small" | "medium" | "large";
  /** Whether to show the full athlete information */
  showFullInfo?: boolean;
  /** Whether to show action buttons */
  showActions?: boolean;
  /** Callback fired when the athlete card is clicked */
  onClick?: (athlete: IAthlete) => void;
  /** Callback fired when the favorite action is triggered */
  onToggleFavorite?: (athlete: IAthlete) => void;
  /** Whether the athlete is currently favorited */
  isFavorited?: boolean;
  /** Additional CSS class name */
  className?: string;
}

export interface AthleteCardRef {
  /** Get the athlete data */
  getAthlete: () => IAthlete;
}
