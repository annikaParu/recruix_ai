import { create } from "zustand";
import { persist } from "zustand/middleware";
import { searchJSearchJobs } from "../lib/jsearch";
import { applyJob, removeSavedJob, saveJob } from "../lib/savedJobsApi";
import type { Job } from "../types/job";
import { supabase } from "../lib/supabase";

type MatchFn = (resumeText: string | undefined, job: Job) => number;

interface JobFilters {
  query: string;
  remoteOnly: boolean;
  employmentType: string;
  location: string;
}

interface JobState {
  jobs: Job[];
  dashboardJobs: Job[];
  selectedJob: Job | null;
  /** Jobs page search / list */
  jobsLoading: boolean;
  /** Dashboard “Top matches” preview */
  dashboardLoading: boolean;
  error: string | null;
  filters: JobFilters;
  resumeText: string;

  savedJobs: Job[];
  appliedJobIds: string[];
  /** Snapshots for /applied (order matches first application) */
  appliedJobs: Job[];
  /** Most recent first, capped */
  recentlyViewedJobs: Job[];

  setFilters: (patch: Partial<JobFilters>) => void;
  setSelectedJob: (job: Job | null) => void;
  setResumeText: (text: string) => void;

  loadResumeFromSupabase: (userId: string) => Promise<void>;

  fetchJobs: (computeMatch: MatchFn) => Promise<Job[]>;
  fetchDashboardPreview: (computeMatch: MatchFn) => Promise<void>;

  toggleSaveJob: (job: Job) => void;
  recordApplication: (job: Job) => void;
  recordRecentView: (job: Job) => void;
}

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      jobs: [],
      dashboardJobs: [],
      selectedJob: null,
      /** True until the first `fetchJobs` run finishes (avoids empty-state flash on Jobs). */
      jobsLoading: true,
      /** True until the first `fetchDashboardPreview` run finishes. */
      dashboardLoading: true,
      error: null,
      filters: {
        query: "Software Engineer",
        remoteOnly: false,
        employmentType: "",
        location: "",
      },
      resumeText: "",

      savedJobs: [],
      appliedJobIds: [],
      appliedJobs: [],
      recentlyViewedJobs: [],

      setFilters: (patch) =>
        set((s) => ({ filters: { ...s.filters, ...patch } })),
      setSelectedJob: (job) => set({ selectedJob: job }),
      setResumeText: (text) => set({ resumeText: text }),

      loadResumeFromSupabase: async (userId: string) => {
        const { data } = await supabase
          .from("profiles")
          .select("resume_text")
          .eq("id", userId)
          .maybeSingle();
        if (data?.resume_text) set({ resumeText: String(data.resume_text) });
      },

      fetchJobs: async (computeMatch) => {
        const { filters, resumeText } = get();
        set({ jobsLoading: true, error: null });
        try {
          const list = await searchJSearchJobs({
            query: filters.query || "Software Engineer",
            remoteOnly: filters.remoteOnly,
            employmentType: filters.employmentType,
          });
          const withScores = list.map((j) => ({
            ...j,
            matchScore: computeMatch(resumeText, j),
          }));
          set({ jobs: withScores, jobsLoading: false });
          return withScores;
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Failed to load jobs";
          set({ error: msg, jobs: [], jobsLoading: false });
          return [];
        }
      },

      fetchDashboardPreview: async (computeMatch) => {
        const { resumeText } = get();
        set({ dashboardLoading: true, error: null });
        try {
          const list = await searchJSearchJobs({ query: "Software Engineer", page: 1 });
          const withScores = list.slice(0, 5).map((j) => ({
            ...j,
            matchScore: computeMatch(resumeText, j),
          }));
          set({ dashboardJobs: withScores, dashboardLoading: false, error: null });
        } catch {
          set({
            dashboardJobs: [],
            dashboardLoading: false,
            error: "Couldn't load live roles — add VITE_RAPIDAPI_KEY for JSearch.",
          });
        }
      },

      toggleSaveJob: (job: Job) => {
        const wasSaved = get().savedJobs.some((j) => j.id === job.id);
        set((s) => {
          const exists = s.savedJobs.some((j) => j.id === job.id);
          if (exists) {
            return { savedJobs: s.savedJobs.filter((j) => j.id !== job.id) };
          }
          return { savedJobs: [...s.savedJobs, { ...job }] };
        });
        void (async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user?.id) return;
          if (wasSaved) {
            await removeSavedJob(user.id, job.id);
          } else {
            await saveJob(user.id, job);
          }
        })();
      },

      recordApplication: (job: Job) => {
        if (get().appliedJobIds.includes(job.id)) return;
        set((s) => ({
          appliedJobIds: [...s.appliedJobIds, job.id],
          appliedJobs: [...s.appliedJobs, { ...job }],
        }));
        void (async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user?.id) return;
          await applyJob(user.id, job);
        })();
      },

      recordRecentView: (job: Job) =>
        set((s) => {
          const rest = s.recentlyViewedJobs.filter((j) => j.id !== job.id);
          return { recentlyViewedJobs: [job, ...rest].slice(0, 24) };
        }),
    }),
    {
      name: "recrux-activity-v1",
      partialize: (state) => ({
        savedJobs: state.savedJobs,
        appliedJobIds: state.appliedJobIds,
        appliedJobs: state.appliedJobs,
        recentlyViewedJobs: state.recentlyViewedJobs,
      }),
    }
  )
);
