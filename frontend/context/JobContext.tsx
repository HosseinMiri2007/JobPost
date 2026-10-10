// frontend/context/JobContext.tsx
"use client";
import {
  AddJobType,
  JobAppliedType,
  JobContextTypes,
  JobType,
} from "@/types/job_types";
import axios from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const JobContext = createContext<JobContextTypes | null>(null);

export default function JobContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [applied, setApplied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [topicInfo, setTopicInfo] = useState<string>("");
  const [jobsApplied, setJobsApplied] = useState<JobAppliedType[]>([]);
  const [userjobs, setUserjobs] = useState<JobType[] | []>([]);
  const router = useRouter();

  async function applytojob(id: string) {
    if (!id) {
      console.error("❌ applytojob called with undefined ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(`/api/job/applyjob/${id}`);

      if (res.data?.applied === true) {
        setApplied(true);
        console.log("✅ Successfully applied to job:", id);
        return res.data;
      }
    } catch (error) {
      setError(error);
      console.error("Error applying to job:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function isApplied(id: string): Promise<boolean> {
    if (!id) {
      console.error("❌ isApplied called with undefined ID");
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`/api/job/isapplied/${id}`);

      const result = res.data === true;
      setApplied(result);
      return result;
    } catch (error) {
      setError(error);
      console.error("Error checking application:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function getTopicStats(topic: string) {
    try {
      const req = await axios.get(`/api/job/topicstats/${topic}`);
      if (req.data) {
        setTopicInfo(req.data);
      }
    } catch (error) {
      console.error("Error getting topic stats:", error);
    }
  }

  async function getCurrentApplieds() {
    try {
      const req = await axios.get("/api/job/appliedjobs/");
      console.log("🔵 Raw data:", req.data);

      if (req.data && Array.isArray(req.data)) {
        setJobsApplied(req.data);
        console.log("🔵 JobsApplied set to:", req.data);
      } else {
        setJobsApplied([]);
      }
    } catch (error) {
      console.error("🔴 Error:", error);
      setJobsApplied([]);
    }
  }

  async function getCurrentUserJobs() {
    try {
      setLoading(true);
      const req = await axios.get("/api/job/currentuserjobs/");
      if (req.data) {
        setUserjobs(req.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError(error);
      console.error("🔴 Error on getcurrentuserjob :", error);
    }
  }

  async function getCandidatesForJob(id: string) {}
  // ---- job crud

  async function addJob(jobData: AddJobType): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`/api/job/new/`, jobData);

      if (response.status === 200 || response.status === 201) {
        toast.success("✅ آگهی استخدام با موفقیت ثبت شد!");

        return response.data;
      }
    } catch (error) {
      setError(error);
      console.error("❌ Error adding job:", error);

      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        if (error.response?.status === 401) {
          toast.error("❌ لطفا وارد حساب کاربری خود شوید");
        } else if (error.response?.status === 404) {
          toast.error("❌ آدرس سرور یافت نشد");
        } else {
          toast.error(error.response?.data?.message || "❌ خطا در ثبت آگهی");
        }
      } else {
        toast.error("❌ خطای ناشناخته در ثبت آگهی");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function deletejob(id: number | undefined) {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(`/api/job/del/${id}`);

      if (response.status === 200 || response.status === 201) {
        toast.success("✅ آگهی استخدام با موفقیت ثبت شد!");
        console.log("✅ Job created successfully:", response.data);

        return response.data;
      }
    } catch (error) {
      setError(error);
      console.error("❌ Error adding job:", error);

      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        if (error.response?.status === 401) {
          toast.error("❌ لطفا وارد حساب کاربری خود شوید");
        } else if (error.response?.status === 404) {
          toast.error("❌ آدرس سرور یافت نشد");
        } else {
          toast.error(error.response?.data?.message || "❌ خطا در ثبت آگهی");
        }
      } else {
        toast.error("❌ خطای ناشناخته در ثبت آگهی");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updatejob(id: number | undefined, jobData: AddJobType) {}
  return (
    <JobContext.Provider
      value={{
        applytojob,
        applied,
        setApplied,
        isApplied,
        getTopicStats,
        topicInfo,
        setTopicInfo,
        getCurrentApplieds,
        jobsApplied,
        setJobsApplied,
        getCurrentUserJobs,
        userjobs,
        setUserjobs,
        getCandidatesForJob,
        addJob,
        deletejob,
        updatejob,
        loading,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}
export function useJob() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJob باید داخل JobContextProvider استفاده بشه");
  }
  return context;
}
