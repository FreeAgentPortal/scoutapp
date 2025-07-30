"use client";

import React, { useState, useRef, useImperativeHandle, forwardRef, KeyboardEvent } from "react";
import { SearchProps, SearchRef } from "./Search.types";
import styles from "./Search.module.scss";

const Search = forwardRef<SearchRef, SearchProps>(
  (
    {
      value: controlledValue,
      placeholder = "Search...",
      disabled = false,
      showSearchIcon = true,
      showClearButton = true,
      size = "medium",
      fullWidth = false,
      loading = false,
      onChange,
      onSearch,
      onClear,
      onFocus,
      onBlur,
      className = "",
      autoFocus = false,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(controlledValue || "");
    const inputRef = useRef<HTMLInputElement>(null);

    // Use controlled value if provided, otherwise use internal state
    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const isControlled = controlledValue !== undefined;

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: () => handleClear(),
      getValue: () => value,
    }));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onSearch?.(value);
      }
    };

    const handleSearchClick = () => {
      onSearch?.(value);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }

      onClear?.();
      onChange?.("");
      inputRef.current?.focus();
    };

    const handleFocus = () => {
      onFocus?.();
    };

    const handleBlur = () => {
      onBlur?.();
    };

    // Build CSS classes
    const containerClasses = [
      styles.searchContainer,
      styles[size],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      loading && styles.loading,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClasses}>
        <div className={styles.searchInputWrapper}>
          {/* Search Icon */}
          {showSearchIcon && (
            <div className={styles.searchIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            placeholder={placeholder}
            disabled={disabled || loading}
            autoFocus={autoFocus}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={styles.searchInput}
            aria-label="Search input"
          />

          {/* Loading Spinner */}
          {loading && (
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner} />
            </div>
          )}

          {/* Clear Button */}
          {showClearButton && value && !loading && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className={styles.clearButton}
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Search Button */}
          {onSearch && (
            <button
              type="button"
              onClick={handleSearchClick}
              disabled={disabled || loading}
              className={styles.searchButton}
              aria-label="Search"
            >
              {loading ? (
                <div className={styles.buttonSpinner} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Search.displayName = "Search";

export default Search;
