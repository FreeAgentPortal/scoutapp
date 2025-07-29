import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import formStyles from "@/styles/Form.module.scss";
import styles from "./MultiSelect.module.scss";

interface MultiSelectProps {
  label: string;
  options: readonly string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onSelectionChange,
  disabled = false,
  placeholder = "Select options...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term and exclude already selected
  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedValues.includes(option)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionSelect = (option: string) => {
    if (!selectedValues.includes(option)) {
      onSelectionChange([...selectedValues, option]);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleRemoveOption = (optionToRemove: string) => {
    onSelectionChange(selectedValues.filter((option) => option !== optionToRemove));
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
      inputRef.current?.blur();
    } else if (e.key === "Enter" && filteredOptions.length > 0) {
      e.preventDefault();
      handleOptionSelect(filteredOptions[0]);
    }
  };

  return (
    <div className={formStyles.arrayField} ref={dropdownRef}>
      <label className={formStyles.label}>{label}</label>
      
      {/* Selected tags display */}
      <div className={formStyles.tagContainer}>
        {selectedValues.map((value, index) => (
          <motion.span
            key={value}
            className={formStyles.tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {value}
            {!disabled && (
              <button
                type="button"
                className={formStyles.tagRemove}
                onClick={() => handleRemoveOption(value)}
                aria-label={`Remove ${value}`}
              >
                ×
              </button>
            )}
          </motion.span>
        ))}
        
        {selectedValues.length === 0 && (
          <span className={styles.placeholder}>
            {disabled ? "No selections" : placeholder}
          </span>
        )}
      </div>

      {/* Search input and dropdown */}
      {!disabled && (
        <div className={styles.inputContainer}>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={`Search ${label.toLowerCase()}...`}
            className={`${formStyles.input} ${styles.searchInput}`}
          />
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className={styles.dropdown}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {filteredOptions.length > 0 ? (
                  <div className={styles.optionsList}>
                    {filteredOptions.slice(0, 10).map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={styles.option}
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                    {filteredOptions.length > 10 && (
                      <div className={styles.moreOptions}>
                        +{filteredOptions.length - 10} more options...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.noOptions}>
                    {searchTerm ? `No matches for "${searchTerm}"` : "No options available"}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
