"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./Reports.module.scss";
import useApiHook from "@/hooks/useApi";
import { IScoutProfile } from "@/types/IScoutProfile";
import { IScoutReport } from "@/types/IScoutReport";
import { useQueryClient } from "@tanstack/react-query";
import Search from "@/components/search/Search.component";
import Paginator from "@/components/pagination/Paginator.component";
import Loader from "@/components/loader/Loader.component";

const REPORTS_PER_PAGE = 10;

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const scoutProfile = useQueryClient().getQueryData(["profile", "scout"]) as { payload: IScoutProfile };
  const { data, isLoading, isError, error } = useApiHook({
    method: "GET",
    url: `/scout`,
    key: ["reports"],
    filter: `scoutId;${scoutProfile?.payload?._id}`,
    enabled: !!scoutProfile?.payload?._id,
    staleTime: 1000 * 60 * 2,
  }) as any;

  const reports = (data?.payload || []) as IScoutReport[];

  // Filter reports based on search query
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;

    const query = searchQuery.toLowerCase();
    return reports.filter((report) => {
      return (
        report.sport?.toLowerCase().includes(query) ||
        report.league?.toLowerCase().includes(query) ||
        report.reportType?.toLowerCase().includes(query) ||
        report.observations?.toLowerCase().includes(query) ||
        report.status?.toLowerCase().includes(query) ||
        report.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [reports, searchQuery]);

  // Paginate filtered results
  const totalPages = Math.ceil(filteredReports.length / REPORTS_PER_PAGE);
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
    return filteredReports.slice(startIndex, startIndex + REPORTS_PER_PAGE);
  }, [filteredReports, currentPage]);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleEditReport = (report: IScoutReport) => {
    // Navigate to the new route structure: /athlete/:athleteId/report/:reportId
    router.push(`/athlete/${report.athleteId}/report/${report._id}`);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status?: string) => {
    const statusClass = status
      ? styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`]
      : styles.statusPending;
    return <span className={`${styles.statusBadge} ${statusClass}`}>{status || "pending"}</span>;
  };

  const getDraftBadge = (isDraft?: boolean) => {
    return (
      <span className={`${styles.draftBadge} ${isDraft ? styles.draft : styles.final}`}>
        {isDraft ? "Draft" : "Final"}
      </span>
    );
  };

  const getVisibilityBadge = (isPublic?: boolean) => {
    return (
      <span className={`${styles.visibilityBadge} ${isPublic ? styles.public : styles.private}`}>
        {isPublic ? "Public" : "Private"}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <Loader />
          <p>Loading your reports...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <h2>Error Loading Reports</h2>
          <p>{error?.message || "Failed to load your reports"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>My Scout Reports</h1>
          <p className={styles.subtitle}>Manage and view all your submitted scout reports ({reports.length} total)</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.controls}>
        <div className={styles.searchSection}>
          <Search
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search reports by sport, league, type, or status..."
            size="medium"
            fullWidth
          />
        </div>

        {searchQuery && (
          <div className={styles.searchResults}>
            Showing {filteredReports.length} of {reports.length} reports
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className={styles.clearSearch}>
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reports Table */}
      {paginatedReports.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.reportsTable}>
            <thead>
              <tr>
                <th>Sport & League</th>
                <th>Athlete</th>
                <th>Type</th>
                <th>Status</th>
                <th>Draft/Final</th>
                <th>Visibility</th>
                <th>Overall Rating</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.map((report) => (
                <tr key={report._id} className={styles.reportRow}>
                  <td className={styles.sportLeague}>
                    <div className={styles.sportName}>{report.sport}</div>
                    <div className={styles.leagueName}>{report.league}</div>
                  </td>
                  <td className={styles.athleteName}>{report.athlete?.fullName || "Unknown Athlete"}</td>
                  <td>
                    <span className={styles.reportType}>
                      {report.reportType.charAt(0).toUpperCase() + report.reportType.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.statusColumn}>{getStatusBadge(report.status)}</div>
                  </td>
                  <td>
                    <div className={styles.statusColumn}>{getDraftBadge(report.isDraft)}</div>
                  </td>
                  <td>{getVisibilityBadge(report.isPublic)}</td>
                  <td className={styles.rating}>
                    <div className={styles.diamondRating}>♦ {report.diamondRating?.toFixed(1) || "N/A"}</div>
                  </td>
                  <td className={styles.date}>{formatDate(report.createdAt)}</td>
                  <td className={styles.actions}>
                    <button 
                      className={styles.actionButton}
                      onClick={() => handleEditReport(report)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          {searchQuery ? (
            <div className={styles.noResults}>
              <h3>No reports found</h3>
              <p>Try adjusting your search terms or clear the search to see all reports.</p>
            </div>
          ) : (
            <div className={styles.noReports}>
              <h3>No reports yet</h3>
              <p>You haven&apos;t submitted any scout reports yet.</p>
            </div>
          )}
        </div>
      )}

      <div className={styles.paginationWrapper}>
        <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default Reports;
