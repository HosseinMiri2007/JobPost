"use client";

import { useJob } from "@/context/JobContext";
import type { AddJobType, JobType } from "@/types/job_types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const initialJob: AddJobType = {
  title: "",
  description: "",
  salary: 0,
  email: "",
  address: "",
  positions: 1,
  company: "",
  last_date: "",
  industry: "کسب و کار",
  jobtype: "تمام وقت",
  education: "لیسانس",
  experience: "بدون سابقه",
};

export default function EditJob() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { getCurrentUserJobs, updatejob, loading } = useJob();

  const id = Number(params.id);

  const [job, setJob] = useState<AddJobType>(initialJob);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchJob() {
      if (!Number.isSafeInteger(id) || id <= 0) {
        setError("شناسه آگهی معتبر نیست");
        setPageLoading(false);
        return;
      }

      if (!getCurrentUserJobs) {
        setError("تابع دریافت آگهی‌ها در دسترس نیست");
        setPageLoading(false);
        return;
      }

      try {
        setPageLoading(true);
        setError("");

        const jobs = await getCurrentUserJobs();

        if (cancelled) return;

        const currentJob = jobs.find((item: JobType) => Number(item.id) === id);

        if (!currentJob) {
          setError("آگهی پیدا نشد یا متعلق به حساب کاربری شما نیست");
          return;
        }

        setJob({
          title: currentJob.title ?? "",
          description: currentJob.description ?? "",
          salary: Number(currentJob.salary ?? 0),
          email: currentJob.email ?? "",
          address: currentJob.address ?? "",
          positions: Number(currentJob.position ?? 1),
          company: currentJob.company ?? "",
          last_date: currentJob.last_date
            ? currentJob.last_date.slice(0, 10)
            : "",
          industry: currentJob.industry ?? "کسب و کار",
          jobtype: currentJob.jobtime ?? "تمام وقت",
          education: currentJob.education ?? "لیسانس",
          experience: currentJob.experience ?? "بدون سابقه",
        });
      } catch (err) {
        if (cancelled) return;

        console.error("Error fetching job:", err);
        setError(
          err instanceof Error ? err.message : "خطا در دریافت اطلاعات آگهی",
        );
      } finally {
        if (!cancelled) {
          setPageLoading(false);
        }
      }
    }

    fetchJob();

    return () => {
      cancelled = true;
    };

    // دریافت آگهی فقط هنگام ورود به شناسه جدید
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setJob((prev) => ({
      ...prev,
      [name]:
        name === "salary" || name === "positions"
          ? value === ""
            ? 0
            : Number(value)
          : value,
    }));
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target;

    setJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!updatejob) {
      setError("تابع ویرایش آگهی در دسترس نیست");
      return;
    }

    if (!Number.isSafeInteger(id) || id <= 0) {
      setError("شناسه آگهی معتبر نیست");
      return;
    }

    try {
      setSubmitting(true);

      await updatejob(id, job);

      router.push("/auth/dashboard");
    } catch (err) {
      console.error("Error updating job:", err);
      setError(
        err instanceof Error
          ? err.message
          : "ویرایش آگهی انجام نشد؛ اطلاعات و خطای سرور را بررسی کنید.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (pageLoading) {
    return <div className="p-6">در حال دریافت اطلاعات آگهی...</div>;
  }

  if (error && !job.title && !job.company) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600">{error}</p>

        <button
          type="button"
          onClick={() => router.push("/auth/dashboard")}
          className="mt-4 rounded-lg border px-4 py-2"
        >
          بازگشت به داشبورد
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const fields = [
    { name: "title", label: "عنوان شغل", type: "text" },
    { name: "company", label: "نام شرکت", type: "text" },
    { name: "salary", label: "حقوق (تومان)", type: "number" },
    { name: "email", label: "ایمیل", type: "email" },
    { name: "address", label: "آدرس", type: "text" },
    { name: "positions", label: "تعداد موقعیت", type: "number" },
  ] as const;

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        ویرایش آگهی استخدام
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label htmlFor={field.name} className="block text-sm font-medium">
                {field.label}
              </label>

              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={job[field.name] ?? ""}
                onChange={handleInputChange}
                className={inputClass}
                required
                min={
                  field.type === "number"
                    ? field.name === "salary"
                      ? 1000000
                      : 1
                    : undefined
                }
              />
            </div>
          ))}

          <div className="space-y-2">
            <label htmlFor="last_date" className="block text-sm font-medium">
              تاریخ انقضا
            </label>

            <input
              id="last_date"
              type="date"
              name="last_date"
              value={job.last_date ?? ""}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium">
              توضیحات شغل
            </label>

            <textarea
              id="description"
              name="description"
              value={job.description ?? ""}
              onChange={handleInputChange}
              rows={5}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="industry" className="block text-sm font-medium">
              صنعت
            </label>

            <select
              id="industry"
              name="industry"
              value={job.industry ?? "کسب و کار"}
              onChange={handleSelectChange}
              className={inputClass}
            >
              <option value="کسب و کار">کسب و کار</option>
              <option value="فناوری و رایانه">فناوری و رایانه</option>
              <option value="بانکداری">بانکداری</option>
              <option value="تحصیلاتی/تمرینی">تحصیلاتی/تمرینی</option>
              <option value="ارتباطات">ارتباطات</option>
              <option value="دیگر">دیگر</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="jobtype" className="block text-sm font-medium">
              نوع همکاری
            </label>

            <select
              id="jobtype"
              name="jobtype"
              value={job.jobtype ?? "تمام وقت"}
              onChange={handleSelectChange}
              className={inputClass}
            >
              <option value="تمام وقت">تمام وقت</option>
              <option value="کارآموزی">کارآموزی</option>
              <option value="پاره وقت">پاره وقت</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="education" className="block text-sm font-medium">
              مدرک تحصیلی
            </label>

            <select
              id="education"
              name="education"
              value={job.education ?? "لیسانس"}
              onChange={handleSelectChange}
              className={inputClass}
            >
              <option value="بدون تحصیلات">بدون تحصیلات</option>
              <option value="لیسانس">لیسانس</option>
              <option value="فوق لیسانس">فوق لیسانس</option>
              <option value="دکترا">دکترا</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="experience" className="block text-sm font-medium">
              سابقه کاری
            </label>

            <select
              id="experience"
              name="experience"
              value={job.experience ?? "بدون سابقه"}
              onChange={handleSelectChange}
              className={inputClass}
            >
              <option value="بدون سابقه">بدون سابقه</option>
              <option value="یک سال">یک سال</option>
              <option value="دو سال">دو سال</option>
              <option value="سه سال و بیشتر">سه سال و بیشتر</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {submitting || loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/auth/dashboard")}
            className="rounded-lg border px-6 py-3"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}
