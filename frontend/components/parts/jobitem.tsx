"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

import {
  Building2,
  Cpu,
  Landmark,
  GraduationCap,
  Wifi,
  CircleHelp,
  BriefcaseBusiness,
  Clock3,
  GraduationCapIcon,
  BookOpen,
  School,
  User,
  UserCheck,
  Users,
  Wallet,
  Clock,
} from "lucide-react";

import type { JobType } from "@/types/job_types";
import moment from "moment-jalaali";

moment.loadPersian({
  dialect: "persian-modern",
  usePersianDigits: true,
});

export function JobItem({
  id,
  title = "کارفرما متنی برای شغل ننوشته",
  industry = "فناوری و رایانه",
  jobtime = "تمام وقت",
  education = "لیسانس",
  experience = "بدون سابقه",
  salary = "ذکر نشده",
  description = "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و ...",
  created_at = "3 ماه پیش",
}: JobType) {
  const router = useRouter();

  const industryIcons = {
    "کسب و کار": Building2,
    "فناوری و رایانه": Cpu,
    بانکداری: Landmark,
    "تحصیلاتی/تمرینی": GraduationCap,
    ارتباطات: Wifi,
    دیگر: CircleHelp,
  };

  const jobTimeIcons = {
    "تمام وقت": BriefcaseBusiness,
    کارآموزی: User,
    "پاره وقت": Clock3,
  };

  const educationIcons = {
    "بدون تحصیلات": School,
    لیسانس: GraduationCapIcon,
    "فوق لیسانس": BookOpen,
    دکترا: GraduationCap,
  };

  const experienceIcons = {
    "بدون سابقه": User,
    "یک سال": UserCheck,
    "دو سال": Users,
    "سه سال و بیشتر": BriefcaseBusiness,
  };

  const IndustryIcon = industryIcons[industry];
  const JobTimeIcon = jobTimeIcons[jobtime];
  const EducationIcon = educationIcons[education];
  const ExperienceIcon = experienceIcons[experience];

  return (
    <div
      className="my-3 cursor-pointer hover:scale-105 transition-all duration-300"
      onClick={() => router.push(`job/${id}/`)}
    >
      <Item variant="outline" className="flex w-full  gap-6 rounded-none p-5">
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
          <ItemDescription>{description}</ItemDescription>
        </ItemContent>

        <ItemActions>
          <Button size="sm">ارسال رزومه</Button>
        </ItemActions>
      </Item>

      <div className="w-full dark:bg-zinc-900 bg-zinc-400 flex flex-wrap justify-between items-center gap-3 p-3">
        <div className="flex items-center gap-2">
          <IndustryIcon size={18} />
          <span>{industry}</span>
        </div>

        <div className="flex items-center gap-2">
          <JobTimeIcon size={18} />
          <span>{jobtime}</span>
        </div>

        <div className="flex items-center gap-2">
          <EducationIcon size={18} />
          <span>{education}</span>
        </div>

        <div className="flex items-center gap-2">
          <ExperienceIcon size={18} />
          <span>{experience}</span>
        </div>
        <div className="flex items-center gap-2">
          <Wallet size={18} />
          <span className="flex gap-2">
            <span>{salary}</span>
            {salary == "ذکر نشده" ? "" : "تومان"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={18} />
          <span className="flex gap-2">
            <span>{moment(created_at).fromNow()}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
