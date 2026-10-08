// frontend/app/auth/dashboard/page.tsx
"use client";
import { useJob } from "@/context/JobContext";
import { stringify } from "querystring";
import { useEffect, useState } from "react";

export default function UserDashboard() {
  const {
    getCurrentApplieds,
    jobsApplied,
    loading,
    getCurrentUserJobs,
    userjobs,
  } = useJob();
  const [isLoading, setIsLoading] = useState(true);
  const [usersjob, getUsersJob] = useState(null);
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

  // Debug: Log when jobsApplied changes
  useEffect(() => {
    console.log("🟢 jobsApplied updated:", jobsApplied);
  }, [jobsApplied]);

  if (isLoading || loading) {
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
