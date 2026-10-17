import { Dispatch, SetStateAction } from "react";
import { UserType } from "./auth_types";

type Industry =
  | "کسب و کار"
  | "فناوری و رایانه"
  | "بانکداری"
  | "تحصیلاتی/تمرینی"
  | "ارتباطات"
  | "دیگر";

type JobTypeValue = "تمام وقت" | "کارآموزی" | "پاره وقت";

type Education = "بدون تحصیلات" | "لیسانس" | "فوق لیسانس" | "دکترا";

type Experience = "بدون سابقه" | "یک سال" | "دو سال" | "سه سال و بیشتر";

export type JobType = {
  id?: number;
  title?: string;
  industry?: Industry;
  jobtime?: JobTypeValue;
  education?: Education;
  experience?: Experience;
  email?: string;
  company?: string;
  address?: string;
  location?: string;
  position?: string;
  salary?: string;
  description?: string;
  created_at?: string;
  last_date?: string;
};

export type AddJobType = {
  title?: string;
  industry?: Industry;
  jobtype?: JobTypeValue;
  education?: Education;
  experience?: Experience;
  email?: string;
  company?: string;
  address?: string;
  positions?: number;
  salary?: number;
  description?: string;
  last_date?: string;
};

export type JobAppliedType = {
  user: number;
  job: JobType;
  resume: string;
  appliedAt: string;
};

export type JobContextTypes = {
  applytojob?: (id: string) => Promise<void>;
  applied?: boolean;
  setApplied?: Dispatch<SetStateAction<boolean>>;
  getTopicStats?: (topic: string) => Promise<void>;
  topicInfo?: string;
  setTopicInfo?: Dispatch<SetStateAction<string>>;
  getCurrentApplieds?: () => Promise<void>;
  jobsApplied?: JobAppliedType[];
  setJobsApplied?: Dispatch<SetStateAction<JobAppliedType[]>>;
  isApplied?: (id: string) => Promise<boolean | undefined>;
  getCurrentUserJobs?: () => Promise<JobType[]>;
  userjobs?: JobType[] | [];
  setUserjobs?: Dispatch<SetStateAction<JobType[]>>;
  getCandidatesForJob?: (id: number | undefined) => Promise<void>;
  candidates?: CandidateType[];
  setcandidates?: Dispatch<SetStateAction<CandidateType[]>>;
  addJob?: (credintianls: AddJobType) => Promise<void>;
  deletejob?: (id: number | undefined) => Promise<void>;
  updatejob?: (
    id: number | undefined,
    credintianls: AddJobType,
  ) => Promise<void>;
  loading?: boolean;
};

export type CandidateType = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  resume: string;
  appliedAt: string;
};
