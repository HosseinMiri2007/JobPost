// frontend/app/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/parts/search";
import { JobItem } from "@/components/parts/jobitem";
import { useEffect, useState } from "react";
import axios from "axios";
import type { JobType } from "@/types/job_types";
import Pagination from "react-js-pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { JobFilter } from "@/components/parts/filters";
import TopicStatsPopup from "@/components/parts/getTopics";

export default function Home() {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [resPerPage, setResPerPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const router = useRouter();
  const searchparams = useSearchParams();
  const page = Number(searchparams.get("page") || 1);
  const keyword = searchparams.get("keyword") || "";

  const fetchJobs = async (params?: URLSearchParams) => {
    setLoading(true);
    try {
      const queryString = params ? `?${params.toString()}` : "";
      const url = `${process.env.API_URL}/api/job/${queryString}`;
      const req = await axios.get(url);
      const data = req.data;

      setJobs(data.job || []);
      setResPerPage(data.resperpage || 0);
      setCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchparams.toString());
    if (keyword) params.set("keyword", keyword);
    if (page) params.set("page", page.toString());

    fetchJobs(params);
  }, [page, keyword]);

  const handleFilterChange = (params: URLSearchParams) => {
    fetchJobs(params);
  };

  const handlePageClick = (currentPage: number) => {
    const params = new URLSearchParams(searchparams.toString());
    params.set("page", currentPage.toString());
    router.push(`/?${params.toString()}`);
    fetchJobs(params);
  };

  return (
    <>
      <div className="flex w-full justify-around px-30 py-10 gap-10">
        <div className="w-full">
          <div className="flex w-full items-center justify-between">
            <div>
              <h2 className="mb-5">آخرین شغل ها</h2>
              <div className="max-w-2xs w-full">
                <JobFilter onFilterChange={handleFilterChange} />
              </div>
              <Search
                setJobs={setJobs}
                setResPerPage={setResPerPage}
                setCount={setCount}
              />
            </div>
            <Button
              onClick={() => setIsPopupOpen(true)}
              className="bg-green-800 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            >
              📊 وضعیت موضوع
            </Button>
          </div>
          {jobs.map((job) => (
            <JobItem
              key={job.id}
              id={job.id}
              title={job.title}
              salary={job.salary}
              industry={job.industry}
              experience={job.experience}
              education={job.education}
              description={job.description}
              created_at={job.created_at}
              jobtime={job.jobtime}
            />
          ))}
          {resPerPage < count && (
            <div className="mt-8 flex justify-center">
              <Pagination
                activePage={page}
                itemsCountPerPage={resPerPage}
                totalItemsCount={count}
                onChange={handlePageClick}
                nextPageText="بعدی →"
                prevPageText="← قبلی"
                firstPageText="« اول"
                lastPageText="آخر »"
                itemClass="inline-flex items-center border border-gray-200 dark:border-gray-700 mx-1 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                linkClass="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
                activeClass="bg-blue-600 border-blue-600 shadow-md shadow-blue-200 dark:shadow-blue-900/30"
                activeLinkClass="text-white hover:text-white hover:bg-blue-700"
                disabledClass="opacity-40 cursor-not-allowed"
              />
            </div>
          )}
        </div>
      </div>

      {/* Popup */}
      <TopicStatsPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
}
