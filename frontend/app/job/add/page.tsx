"use client";

import { useJob } from "@/context/JobContext";
import type { AddJobType } from "@/types/job_types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddJob() {
  const router = useRouter();
  const { addJob } = useJob();
  const [job, setJob] = useState<AddJobType>({
    title: "",
    description: "",
    salary: 0,
    email: "",
    address: "",
    positions: 0,
    company: "",
    last_date: "",
    industry: "کسب و کار",
    jobtype: "تمام وقت",
    education: "لیسانس",
    experience: "بدون سابقه",
  });

  // Handle text input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Job data to send:", job);

    if (addJob) {
      await addJob(job);
      router.push("/");
    }
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        اضافه کردن شغل جدید
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">موضوع</label>
            <input
              type="text"
              name="title"
              value={job.title || ""}
              onChange={handleInputChange}
              placeholder="موضوع شغل را وارد کنید"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">نام شرکت</label>
            <input
              type="text"
              name="company"
              value={job.company || ""}
              onChange={handleInputChange}
              placeholder="نام شرکت را وارد کنید"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">حقوق (تومان)</label>
            <input
              type="number"
              name="salary"
              value={job.salary || ""}
              onChange={handleInputChange}
              placeholder="میزان حقوق را وارد کنید"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">ایمیل</label>
            <input
              type="email"
              name="email"
              value={job.email || ""}
              onChange={handleInputChange}
              placeholder="ایمیل شرکت را وارد کنید"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">آدرس</label>
            <input
              type="text"
              name="address"
              value={job.address || ""}
              onChange={handleInputChange}
              placeholder="آدرس شرکت را وارد کنید"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Positions */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">تعداد موقعیت</label>
            <input
              type="number"
              name="positions"
              value={job.positions || ""}
              onChange={handleInputChange}
              placeholder="تعداد موقعیت‌ها را وارد کنید"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Last Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">تاریخ انقضا</label>
            <input
              type="date"
              name="last_date"
              value={job.last_date || ""}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium">توضیحات</label>
            <textarea
              name="description"
              value={job.description || ""}
              onChange={handleInputChange}
              placeholder="توضیحات کامل شغل را وارد کنید"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
              required
            />
          </div>
        </div>

        {/* Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Industry */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">صنعت</label>
            <select
              name="industry"
              value={job.industry}
              onChange={handleSelectChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="کسب و کار">کسب و کار</option>
              <option value="فناوری و رایانه">فناوری و رایانه</option>
              <option value="بانکداری">بانکداری</option>
              <option value="تحصیلاتی/تمرینی">تحصیلاتی/تمرینی</option>
              <option value="ارتباطات">ارتباطات</option>
              <option value="دیگر">دیگر</option>
            </select>
          </div>

          {/* Job Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">نوع همکاری</label>
            <select
              name="jobtype"
              value={job.jobtype}
              onChange={handleSelectChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="تمام وقت">تمام وقت</option>
              <option value="کارآموزی">کارآموزی</option>
              <option value="پاره وقت">پاره وقت</option>
            </select>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">مدرک تحصیلی</label>
            <select
              name="education"
              value={job.education}
              onChange={handleSelectChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="بدون تحصیلات">بدون تحصیلات</option>
              <option value="لیسانس">لیسانس</option>
              <option value="فوق لیسانس">فوق لیسانس</option>
              <option value="دکترا">دکترا</option>
            </select>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">سابقه کاری</label>
            <select
              name="experience"
              value={job.experience}
              onChange={handleSelectChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="بدون سابقه">بدون سابقه</option>
              <option value="یک سال">یک سال</option>
              <option value="دو سال">دو سال</option>
              <option value="سه سال و بیشتر">سه سال و بیشتر</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            اضافه کردن شغل
          </button>
        </div>
      </form>
    </div>
  );
}
