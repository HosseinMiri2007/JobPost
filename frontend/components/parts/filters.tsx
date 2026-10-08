"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, X } from "lucide-react";

type FilterProps = {
  onFilterChange: (params: URLSearchParams) => void;
};

export function JobFilter({ onFilterChange }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // حالت‌های فیلتر
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    address: searchParams.get("address") || "",
    education: searchParams.get("education") || "",
    jobtype: searchParams.get("jobtype") || "",
    industry: searchParams.get("industry") || "",
    experience: searchParams.get("experience") || "",
    minSalary: Number(searchParams.get("min_salary")) || 1000000,
    maxSalary: Number(searchParams.get("max_salary")) || 1000000000,
  });

  const [isOpen, setIsOpen] = useState(false);

  // گزینه‌های فیلتر (از مدل‌های Django)
  const educationOptions = [
    { value: "بدون تحصیلات", label: "بدون تحصیلات" },
    { value: "لیسانس", label: "لیسانس" },
    { value: "فوق لیسانس", label: "فوق لیسانس" },
    { value: "دکترا", label: "دکترا" },
  ];

  const jobTypeOptions = [
    { value: "کارآموزی", label: "کارآموزی" },
    { value: "تمام وقت", label: "تمام وقت" },
    { value: "پاره وقت", label: "پاره وقت" },
  ];

  const industryOptions = [
    { value: "کسب و کار", label: "کسب و کار" },
    { value: "فناوری و رایانه", label: "فناوری و رایانه" },
    { value: "بانکداری", label: "بانکداری" },
    { value: "تحصیلاتی/تمرینی", label: "تحصیلاتی/تمرینی" },
    { value: "ارتباطات", label: "ارتباطات" },
    { value: "دیگر", label: "دیگر" },
  ];

  const experienceOptions = [
    { value: "بدون سابقه", label: "بدون سابقه" },
    { value: "یک سال", label: "یک سال" },
    { value: "دو سال", label: "دو سال" },
    { value: "سه سال و بیشتر", label: "سه سال و بیشتر" },
  ];

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.keyword) params.append("keyword", filters.keyword);
    if (filters.address) params.append("address", filters.address);
    if (filters.education) params.append("education", filters.education);
    if (filters.jobtype) params.append("jobtype", filters.jobtype);
    if (filters.industry) params.append("industry", filters.industry);
    if (filters.experience) params.append("experience", filters.experience);
    if (filters.minSalary > 1000000)
      params.append("min_salary", filters.minSalary.toString());
    if (filters.maxSalary < 1000000000)
      params.append("max_salary", filters.maxSalary.toString());

    params.append("page", "1");

    router.push(`/?${params.toString()}`);
    onFilterChange(params);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      address: "",
      education: "",
      jobtype: "",
      industry: "",
      experience: "",
      minSalary: 1000000,
      maxSalary: 1000000000,
    });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "minSalary") return Number(value) > 1000000;
    if (key === "maxSalary") return Number(value) < 1000000000;
    return value && value !== "";
  }).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="ml-2 h-4 w-4" />
          فیلترها
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            فیلترهای جستجو
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* جستجوی متنی */}
          <div className="space-y-2">
            <Label>جستجو در عنوان شغل</Label>
            <Input
              placeholder="عنوان شغل..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters({ ...filters, keyword: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>موقعیت مکانی</Label>
            <Input
              placeholder="شهر، استان..."
              value={filters.address}
              onChange={(e) =>
                setFilters({ ...filters, address: e.target.value })
              }
            />
          </div>

          {/* محدوده حقوق */}
          <div className="space-y-4">
            <Label>محدوده حقوق (تومان)</Label>
            <div className="px-2">
              <Slider
                min={1000000}
                max={1000000000}
                step={1000000}
                value={[filters.minSalary, filters.maxSalary]}
                onValueChange={([min, max]) =>
                  setFilters({ ...filters, minSalary: min, maxSalary: max })
                }
                className="my-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{filters.minSalary.toLocaleString()}</span>
                <span>{filters.maxSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* فیلترهای انتخابی */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>نوع همکاری</Label>
              <Select
                value={filters.jobtype}
                onValueChange={(value) =>
                  setFilters({ ...filters, jobtype: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">همه</SelectItem>
                  {jobTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>مدرک تحصیلی</Label>
              <Select
                value={filters.education}
                onValueChange={(value) =>
                  setFilters({ ...filters, education: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">همه</SelectItem>
                  {educationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>صنعت</Label>
              <Select
                value={filters.industry}
                onValueChange={(value) =>
                  setFilters({ ...filters, industry: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">همه</SelectItem>
                  {industryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>سابقه کار</Label>
              <Select
                value={filters.experience}
                onValueChange={(value) =>
                  setFilters({ ...filters, experience: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">همه</SelectItem>
                  {experienceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* دکمه‌های اقدام */}
        <div className="flex gap-3 justify-end border-t pt-4">
          <Button variant="outline" onClick={clearFilters}>
            <X className="ml-2 h-4 w-4" />
            پاک کردن همه
          </Button>
          <Button
            onClick={applyFilters}
            className="bg-blue-600 hover:bg-blue-700"
          >
            اعمال فیلترها
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
