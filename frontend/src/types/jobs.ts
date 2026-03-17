/** Unified job shape for JobCard and API-normalized data */
export interface Job {
  id: string;
  title: string;
  company: string;
  industryStage?: string;
  location: string;
  workplace: "Remote" | "Hybrid" | "On-site";
  salary: string;
  match: number;
  h1bStatus?: string;
  tags: string[];
  postedAt: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  level?: string;
  experienceLabel?: string;
  years?: string;
  category?: string;
  logoColor?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  companyLogo?: string;
  applyUrl?: string;
  source?: string;
  postedAgo?: string;
  applicantCount?: string | null;
  isEarlyApplicant?: boolean;
}
