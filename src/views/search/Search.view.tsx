"use client";

import React from "react";
import { useSearchStore } from "@/state/search";
import useApiHook from "@/hooks/useApi";
import SearchComponent from "@/components/search";
import AthleteCard from "@/components/athleteCard";
import { IAthlete } from "@/types/IAthlete";
import styles from "./Search.module.scss";

const Search: React.FC = () => {
  // Get search state and actions from zustand store
  const { search, setSearch, pageNumber, pageLimit, filter, sort } = useSearchStore();

  // API hook for fetching athletes - reactive to key changes
  const { data, isLoading, isError, error } = useApiHook({
    method: "GET",
    url: `/profiles/athlete`,
    key: ["athletes", search, pageNumber.toString(), pageLimit.toString(), filter, sort],
    enabled: true, // Always enabled, will refetch when key changes
    staleTime: 1000 * 60 * 2, // 2 minutes
  }) as any;

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearch(value);
    // The API will automatically refetch due to key change
  };

  // Handle search submission (Enter key or button click)
  const handleSearch = (value: string) => {
    // Ensure the search state is updated if different
    if (search !== value) {
      setSearch(value);
    }
    // The API hook will handle the actual search via key reactivity
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearch("");
    // The API will automatically refetch with empty search
  };

  // Handle athlete card interactions
  const handleAthleteClick = (athlete: IAthlete) => {
    console.log("Athlete clicked:", athlete.fullName);
    // TODO: Navigate to athlete detail view
  };

  const handleViewProfile = (athlete: IAthlete) => {
    console.log("View profile for:", athlete.fullName);
    // TODO: Navigate to athlete profile page
  };

  const handleToggleFavorite = (athlete: IAthlete) => {
    console.log("Toggle favorite for:", athlete.fullName);
    // TODO: Toggle favorite status
  };

  return (
    <div className={styles.searchContainer}>
      {/* Header Section */}
      <header className={styles.searchHeader}>
        <h1 className={styles.title}>Athlete Search</h1>
        <p className={styles.subtitle}>Find athletes to generate scout reports</p>
      </header>

      {/* Search Interface */}
      <section className={styles.searchInterface}>
        {/* Primary Search Bar */}
        <div className={styles.searchBar}>
          <SearchComponent
            value={search}
            placeholder="Search athletes by name, college, position..."
            size="large"
            fullWidth
            showSearchIcon
            showClearButton
            loading={isLoading}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />
        </div>

        {/* Search Filters */}
        <div className={styles.searchFilters}>
          {/* TODO: Add filters component */}
          <div className={styles.filtersPlaceholder}>
            <p>Search filters will go here</p>
          </div>
        </div>

        {/* Search Actions */}
        <div className={styles.searchActions}>
          {/* TODO: Add search button and clear filters */}
          <div className={styles.actionsPlaceholder}>
            <p>Search actions (search button, clear filters) will go here</p>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className={styles.resultsSection}>
        {/* Results Header */}
        <div className={styles.resultsHeader}>
          <div className={styles.resultsInfo}>
            {isLoading ? (
              <p>Searching athletes...</p>
            ) : isError ? (
              <p className={styles.errorText}>Error loading results: {error?.message}</p>
            ) : data?.payload ? (
              <p>Found {data.payload.length} athletes</p>
            ) : (
              <p>Enter a search term to find athletes</p>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className={styles.resultsGrid}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Loading athletes...</p>
            </div>
          ) : isError ? (
            <div className={styles.errorState}>
              <p>Unable to load search results</p>
              <p className={styles.errorDetails}>{error?.message}</p>
            </div>
          ) : data?.payload && data.payload.length > 0 ? (
            <div className={styles.athleteGrid}>
              {data.payload.map((athlete: IAthlete, index: number) => (
                <AthleteCard
                  key={athlete._id || index}
                  athlete={athlete}
                  size="medium"
                  showFullInfo={true}
                  showActions={true}
                  onClick={handleAthleteClick}
                  onViewProfile={handleViewProfile}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorited={false} // TODO: Implement favorite tracking
                />
              ))}
            </div>
          ) : search ? (
            <div className={styles.emptyState}>
              <p>No athletes found for "{search}"</p>
              <p>Try adjusting your search terms</p>
            </div>
          ) : (
            <div className={styles.welcomeState}>
              <p>Enter a search term above to find athletes</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          {/* TODO: Add pagination component */}
          <div className={styles.paginationPlaceholder}>
            <p>Pagination controls will go here</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Search;
