"use client";

import React, { useState } from "react";
import { useSearchStore } from "@/state/search";
import useApiHook from "@/hooks/useApi";
import SearchComponent from "@/components/search";
import AthleteCard from "@/components/athleteCard";
import Paginator from "@/components/pagination/Paginator.component";
import { IAthlete } from "@/types/IAthlete";
import styles from "./Search.module.scss";
import { useInterfaceStore } from "@/state/interface";
import { useQueryClient } from "@tanstack/react-query";
import { IScoutProfile } from "@/types/IScoutProfile";

const Search: React.FC = () => {

  const profile = useQueryClient().getQueryData(["profile", "scout"]) as { payload: IScoutProfile};
  // Get search state and actions from zustand store
  const { search, setSearch, pageNumber, setPageNumber } = useSearchStore();
  const { addAlert } = useInterfaceStore(state => state);
  // Local input state for the search field (separate from the actual search query)
  const [inputValue, setInputValue] = useState(search);

  // API hook for fetching athletes - reactive to key changes
  const { data, isLoading, isError, error } = useApiHook({
    method: "GET",
    url: `/profiles/athlete`,
    limit: 5,
    key: ["athletes", search, pageNumber.toString()],
    enabled: true, // Always enabled, will refetch when key changes
    staleTime: 1000 * 60 * 2, // 2 minutes
  }) as any;

  const { mutate: favoriteAthlete } = useApiHook({
    method: "POST",
    key: ["favoriteAthlete"],
    queriesToInvalidate: ["profile,scout"],
  }) as any;
  // Handle search input changes (just update local state, don't trigger API)
  const handleSearchChange = (value: string) => {
    setInputValue(value);
  };

  // Handle search submission (Enter key or button click) - this triggers the API
  const handleSearch = (value: string) => {
    setSearch(value); // This will trigger API refetch via key change
    setInputValue(value); // Keep input in sync
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearch("");
    setInputValue("");
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
    favoriteAthlete(
      {
        url: `/profiles/scout/favorite-athlete/${athlete._id}`,
      },
      {
        onSuccess: () => {
          console.log("Toggled favorite for:", athlete.fullName);
          addAlert({
            type: "success",
            message: `Successfully toggled favorite for ${athlete.fullName}`,
          });
        },
      }
    );
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setPageNumber(page);
    // The API will automatically refetch due to key change
  };

  // Calculate total pages from API response
  const totalResults = data?.metadata?.totalCount || data?.payload?.length || 0;
  const totalPages = data?.metadata?.totalPages || Math.ceil(totalResults / 5); // Assuming 5 results per page

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
            value={inputValue}
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
                <p>
                  Found {totalResults} athletes
                  {totalPages > 1 && (
                    <span>
                      {" "}
                      • Page {pageNumber} of {totalPages}
                    </span>
                  )}
                </p>
              ) : (
                <p>Enter a search term to find athletes</p>
              )}
            </div>
          </div>
        </section>

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
                  isFavorited={
                    profile?.payload?.favoritedAthletes?.includes(athlete._id) || false
                  }
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
          {totalPages > 1 && (
            <Paginator currentPage={pageNumber} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </div>
      </section>
    </div>
  );
};

export default Search;
