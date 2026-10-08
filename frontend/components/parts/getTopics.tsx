"use client";

import { useState } from "react";
import { useJob } from "@/context/JobContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search, Loader2 } from "lucide-react";

interface TopicStatsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TopicStatsPopup({
  isOpen,
  onClose,
}: TopicStatsPopupProps) {
  const [topic, setTopic] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { getTopicStats, topicInfo } = useJob();

  const handleSearch = async () => {
    try {
      if (getTopicStats) {
        setIsSearching(true);
        await getTopicStats(topic);
      }
    } catch (error) {
      console.log(
        "error faced on page handleserach function in getTopics component \n",
        error,
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  // Parse the stats from topicInfo
  const stats = topicInfo ? JSON.parse(JSON.stringify(topicInfo)) : null;

  return (
    // Backdrop overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Popup container */}
      <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            📊 وضعیت موضوع
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Search area */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="موضوع مورد نظر را وارد کنید..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 pr-4 py-2.5 w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                disabled={isSearching}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!topic.trim() || isSearching}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  در حال جستجو...
                </>
              ) : (
                "جستجو"
              )}
            </Button>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            💡 مثلاً: برنامه‌نویسی، طراحی، بازاریابی، مدیریت
          </p>
        </div>

        {/* Results area */}
        <div className="px-6 pb-6">
          {topicInfo ? (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Topic title */}
              <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                  📌 نتایج جستجو برای:{" "}
                  <span className="font-bold">{topic}</span>
                </h3>
              </div>

              {/* Stats table */}
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        آمار
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        مقدار
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {stats &&
                      Object.entries(stats).map(([key, value]) => (
                        <tr
                          key={key}
                          className="hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {formatStatKey(key)}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {formatStatValue(key, value)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p>برای مشاهده آمار، یک موضوع را جستجو کنید</p>
              <p className="text-sm mt-1">
                مثال: برنامه‌نویسی، طراحی، بازاریابی
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions for formatting
function formatStatKey(key: string): string {
  const map: Record<string, string> = {
    total_jobs: "📋 تعداد کل شغل‌ها",
    avg_positions: "👥 میانگین موقعیت‌ها",
    avg_salary: "💰 میانگین حقوق",
    min_salary: "⬇️ کمترین حقوق",
    max_salary: "⬆️ بیشترین حقوق",
  };
  return map[key] || key.replace(/_/g, " ");
}

function formatStatValue(key: string, value: any): string {
  if (key.includes("salary") && typeof value === "number") {
    return `${value.toLocaleString()} تومان`;
  }
  if (typeof value === "number") {
    return value.toFixed(1);
  }
  return String(value ?? "—");
}
