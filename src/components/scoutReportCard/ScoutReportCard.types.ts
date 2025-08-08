import { IScoutReport } from "@/types/IScoutReport";

export interface ScoutReportCardProps {
  report: IScoutReport;
  onClick?: () => void;
  isRestricted?: boolean; // Whether the user can access the full report
}
