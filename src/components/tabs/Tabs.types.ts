/**
 * Represents a single tab item with its content
 */
export interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Optional icon (emoji or icon string) */
  icon?: React.ComponentType<any> | React.ReactNode | string;
  /** The component to render when this tab is active.
   * Can be either a React component class/function or a pre-rendered element */
  component: React.ComponentType<any> | React.ReactNode;
  /** Props to pass to the component if it's a component class/function */
  props?: Record<string, any>;
}

/**
 * Props for the Tabs component
 */
export interface TabsProps {
  /** Array of tab items */
  tabs: TabItem[];
  /** ID of the currently active tab (optional - if not provided, component manages its own state) */
  activeTab?: string;
  /** Callback when a tab is clicked (optional - if not provided, component manages its own state) */
  onTabChange?: (tabId: string) => void;
  /** Default active tab ID when using internal state management */
  defaultActiveTab?: string;
  /** Optional additional CSS class */
  className?: string;
  /** Optional additional CSS class for children components */
  childrenClassName?: string;
}
