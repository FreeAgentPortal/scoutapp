export interface SearchProps {
  /** The current search value */
  value?: string;
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Whether the search input is disabled */
  disabled?: boolean;
  /** Whether to show the search icon */
  showSearchIcon?: boolean;
  /** Whether to show the clear button when there's text */
  showClearButton?: boolean;
  /** Size variant of the search input */
  size?: "small" | "medium" | "large";
  /** Whether the search input should take full width */
  fullWidth?: boolean;
  /** Whether to show a loading state */
  loading?: boolean;
  /** Callback fired when the search value changes */
  onChange?: (value: string) => void;
  /** Callback fired when the search is submitted (Enter key or search button) */
  onSearch?: (value: string) => void;
  /** Callback fired when the clear button is clicked */
  onClear?: () => void;
  /** Callback fired when the input is focused */
  onFocus?: () => void;
  /** Callback fired when the input loses focus */
  onBlur?: () => void;
  /** Additional CSS class name */
  className?: string;
  /** Auto focus the input on mount */
  autoFocus?: boolean;
}

export interface SearchRef {
  /** Focus the search input */
  focus: () => void;
  /** Blur the search input */
  blur: () => void;
  /** Clear the search input */
  clear: () => void;
  /** Get the current search value */
  getValue: () => string;
}
