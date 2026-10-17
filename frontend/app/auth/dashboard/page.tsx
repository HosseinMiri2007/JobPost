// frontend/app/auth/dashboard/page.tsx
"use client";
import { useJob } from "@/context/JobContext";
import { Eye, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function UserDashboard() {
  const {
    getCurrentApplieds,
    jobsApplied,
    loading,
    getCurrentUserJobs,
    userjobs,
    deletejob,
    getCandidatesForJob,
    candidates,
  } = useJob();
  const [isLoading, setIsLoading] = useState(true);

  const handleDialogTriggerClick = useCallback(
    (id: number | undefined) => {
      if (id !== undefined && getCandidatesForJob) {
        getCandidatesForJob(id);
      }
    },
    [getCandidatesForJob],
  );

  const handleDelete = useCallback(
    async (id: number | undefined) => {
      if (id === undefined || !deletejob || !getCurrentUserJobs) return;
      await deletejob(id);
      await getCurrentUserJobs();
    },
    [deletejob, getCurrentUserJobs],
  );

  useEffect(() => {
    async function fetchJobs() {
      try {
        setIsLoading(true);
        if (getCurrentApplieds) {
          console.log("🟢 Fetching jobs...");
          await getCurrentApplieds();
          if (getCurrentUserJobs) {
            await getCurrentUserJobs();
          }
        }
      } catch (error) {
        console.error("🔴 Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  useEffect(() => {
    // Debug: Log when jobsApplied changes
    console.log("🟢 jobsApplied updated:", jobsApplied);
  }, [jobsApplied]);

  if (isLoading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">داشبورد</h1>

      <div>
        <h2 className="text-xl font-semibold mb-3">شغل های درخواست شده</h2>

        {!jobsApplied || jobsApplied.length === 0 ? (
          <p className="text-gray-500">
            شما هنوز به هیچ شغلی درخواست نداده‌اید
          </p>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-right">عنوان شغل</th>
                  <th className="p-2 text-right">شرکت</th>
                  <th className="p-2 text-right">تاریخ درخواست</th>
                  <th className="p-2 text-right">حقوق</th>
                </tr>
              </thead>
              <tbody>
                {jobsApplied.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{item.job?.title || "—"}</td>
                    <td className="p-2">{item.job?.company || "—"}</td>
                    <td className="p-2">
                      {item.appliedAt
                        ? new Date(item.appliedAt).toLocaleDateString("fa-IR")
                        : "—"}
                    </td>
                    <td className="p-2">{item.job?.salary || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* the jobs user made */}
            <h2 className="text-xl font-semibold mb-3">شغل های ساخته شده</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-right">عنوان شغل</th>
                  <th className="p-2 text-right">شرکت</th>
                  <th className="p-2 text-right">تحصیلات</th>
                  <th className="p-2 text-right">حقوق</th>
                  <th className="p-2 text-right">صنعت</th>
                  <th className="p-2 text-right">تجربه</th>
                  <th className="p-2 text-right">عملیات ها</th>
                </tr>
              </thead>
              <tbody>
                {userjobs && userjobs.length > 0 ? (
                  userjobs.map((item, index) => (
                    <tr
                      key={item.id ?? index}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-2">{item.title || "—"}</td>
                      <td className="p-2">{item.company || "—"}</td>
                      <td className="p-2">{item.education || "—"}</td>
                      <td className="p-2">{item.salary || "—"}</td>
                      <td className="p-2">{item.industry || "—"}</td>
                      <td className="p-2">{item.experience || "—"}</td>
                      <td className="p-2 flex items-center">
                        <button
                          className="px-2 py-1 rounded"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash />
                        </button>

                        <Link
                          href={`/job/update/${item.id}`}
                          className="px-2 py-1 rounded"
                        >
                          <Pencil />
                        </Link>

                        <Dialog>
                          <DialogTrigger
                            className="px-2 py-1 rounded"
                            onClick={() => handleDialogTriggerClick(item.id)}
                          >
                            <Eye />
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>داوطلبین شغل</DialogTitle>
                              <DialogDescription className="sr-only">
                                لیست افرادی که برای این شغل درخواست داده‌اند
                              </DialogDescription>
                            </DialogHeader>

                            {candidates && candidates.length > 0 ? (
                              <ul className="space-y-2">
                                {candidates.map((c, index) => (
                                  <li
                                    key={c.id}
                                    className="flex items-center justify-between border-b pb-2"
                                  >
                                    <span className="flex items-center gap-2">
                                      <span>{index}</span>
                                      {c.first_name || c.last_name
                                        ? `${c.first_name} ${c.last_name}`.trim()
                                        : c.username}
                                    </span>
                                    <a
                                      href={`${process.env.API_URL}/media/${c.resume}`}
                                      download
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                                    >
                                      دانلود رزومه
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500">
                                هنوز کسی درخواست نداده است
                              </p>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-2 text-gray-500 text-center">
                      شما هنوز آگهی‌ای ثبت نکرده‌اید
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
