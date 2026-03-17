import axios from "axios";

const BASE_URL = "https://jsearch.p.rapidapi.com";

const getHeaders = () => ({
  "X-RapidAPI-Key": import.meta.env.VITE_JSEARCH_API_KEY as string,
  "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
});

export interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_is_remote?: boolean;
  job_employment_type?: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_required_experience?: { required_experience_in_months?: number };
  job_description?: string;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
  job_required_skills?: string[];
  job_apply_link?: string;
  job_posted_at_datetime_utc?: string;
  job_apply_quality_score?: number;
  job_offer_expiration_datetime_utc?: string | null;
  job_publisher?: string;
}

export interface SearchJobsParams {
  query?: string;
  page?: number;
  employment_type?: string;
  date_posted?: string;
  remote_jobs_only?: boolean;
  job_requirements?: string;
}

export async function searchJobs(params: SearchJobsParams = {}): Promise<JSearchJob[]> {
  const {
    query = "Software Engineer",
    page = 1,
    employment_type = "",
    date_posted = "all",
    remote_jobs_only = false,
    job_requirements = "",
  } = params;

  const response = await axios.get<{ data: JSearchJob[] }>(`${BASE_URL}/search`, {
    headers: getHeaders(),
    params: {
      query,
      page,
      num_pages: 1,
      date_posted,
      remote_jobs_only,
      employment_type: employment_type || undefined,
      job_requirements: job_requirements || undefined,
    },
  });
  return response.data?.data ?? [];
}

export async function getJobDetails(jobId: string) {
  const response = await axios.get<{ data: JSearchJob[] }>(`${BASE_URL}/job-details`, {
    headers: getHeaders(),
    params: { job_id: jobId },
  });
  return response.data?.data?.[0] ?? null;
}

export async function getJobSalary(jobTitle: string, location: string) {
  const response = await axios.get(`${BASE_URL}/estimated-salary`, {
    headers: getHeaders(),
    params: { job_title: jobTitle, location, radius: "100" },
  });
  return response.data?.data;
}
