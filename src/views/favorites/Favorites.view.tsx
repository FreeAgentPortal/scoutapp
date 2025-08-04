"use client";
import React from "react";
import { useSearchStore } from "@/state/search";
import { useInterfaceStore } from "@/state/interface";
import { useQueryClient } from "@tanstack/react-query";
import useApiHook from "@/hooks/useApi";
import AthleteCard from "@/components/athleteCard";
import Paginator from "@/components/pagination/Paginator.component";
import { IAthlete } from "@/types/IAthlete";
import { IScoutProfile } from "@/types/IScoutProfile";
import styles from "./Favorites.module.scss";

const Favorites = () => {
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData(["profile", "scout"]) as { payload: IScoutProfile };

  // Get search state and actions from zustand store (reusing for pagination)
  const { pageNumber, pageLimit, setPageNumber } = useSearchStore();
  const { addAlert } = useInterfaceStore((state) => state);

  // API hook for fetching favorite athletes - reactive to page changes
  const { data, isLoading, isError, error } = useApiHook({
    method: "GET",
    url: `/profiles/scout/favorite-athlete`,
    limit: pageLimit,
    key: ["favorites", pageNumber.toString()],
    enabled: true,
    staleTime: 1000 * 60 * 2, // 2 minutes
  }) as any;

  // API hook for unfavoriting an athlete
  const { mutate: unfavoriteAthlete } = useApiHook({
    method: "POST",
    key: ["unfavoriteAthlete"],
    queriesToInvalidate: ["favorites", "profile,scout"],
  }) as any;

  const handleToggleFavorite = (athlete: IAthlete) => {
    unfavoriteAthlete(
      {
        url: `/profiles/scout/favorite-athlete/${athlete._id}`,
      },
      {
        onSuccess: () => {
          console.log("Unfavorited athlete:", athlete.fullName);
          addAlert({
            type: "success",
            message: `Successfully removed ${athlete.fullName} from favorites`,
          });
        },
        onError: (error: any) => {
          console.error("Failed to unfavorite athlete:", error);
          addAlert({
            type: "error",
            message: `Failed to remove ${athlete.fullName} from favorites`,
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
  const totalPages = data?.metadata?.totalPages || Math.ceil(totalResults / pageLimit);

  return (
    <div className={styles.favoritesContainer}>
      {/* Header Section */}
      <header className={styles.favoritesHeader}>
        <h1 className={styles.title}>Favorite Athletes</h1>
        <p className={styles.subtitle}>Your starred athletes for easy access</p>
      </header>

      {/* Favorites Interface */}
      <section className={styles.favoritesInterface}>
        {/* Results Section */}
        <section className={styles.resultsSection}>
          {/* Results Header */}
          <div className={styles.resultsHeader}>
            <div className={styles.resultsInfo}>
              {isLoading ? (
                <p>Loading your favorite athletes...</p>
              ) : isError ? (
                <p className={styles.errorText}>Error loading favorites: {error?.message}</p>
              ) : data?.payload ? (
                <p>
                  {totalResults} favorite athlete{totalResults !== 1 ? "s" : ""}
                  {totalPages > 1 && (
                    <span>
                      {" "}
                      • Page {pageNumber} of {totalPages}
                    </span>
                  )}
                </p>
              ) : (
                <p>No favorite athletes yet</p>
              )}
            </div>
          </div>
        </section>

        {/* Results Grid */}
        <div className={styles.resultsGrid}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Loading favorite athletes...</p>
            </div>
          ) : isError ? (
            <div className={styles.errorState}>
              <p>Unable to load favorite athletes</p>
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
                  onToggleFavorite={handleToggleFavorite}
                  isFavorited={true} // All athletes in favorites are favorited
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No favorite athletes yet</p>
              <p>Visit the search page to add athletes to your favorites</p>
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

export default Favorites;
