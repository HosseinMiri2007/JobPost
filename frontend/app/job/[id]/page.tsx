import axios from "axios";
import type { JobType } from "@/types/job_types";
import { useJob } from "@/context/JobContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Building2,
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
  Mail,
  CalendarDays,
  Wallet,
  Users,
  Clock3,
  HistoryIcon,
} from "lucide-react";
import Map from "@/components/parts/Map";
import { UserType } from "@/types/auth_types";
import { JobInteraction } from "@/components/parts/jobInteraction";
import Candidates from "@/components/parts/candidates";

export default async function JobDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const req = await axios.get(`${process.env.API_URL}/api/job/${id}`);

  const job: JobType | null = req.data.job;
  const candidates: UserType | null = req.data.applied;
  if (candidates) {
    console.log("candidates found : ", candidates);
  } else {
    console.log("candidates not found : ", candidates);
  }
  const point = job.location
    .replace("SRID=4326;POINT (", "")
    .replace(")", "")
    .split(" ");

  const lng = Number(point[0]);
  const lat = Number(point[1]);

  console.log(lat);
  console.log(lng);
  return (
    <main className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-3xl font-bold">
                      {job.title}
                    </CardTitle>

                    <p className="mt-3 flex items-center gap-2 text-muted-foreground">
                      <Building2 size={18} />
                      {job.company}
                    </p>
                  </div>

                  <Badge className="text-sm px-4 py-2">{job.jobtype}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Info
                    icon={<Wallet size={18} />}
                    title="حقوق"
                    value={`${job.salary.toLocaleString()} تومان`}
                  />

                  <Info
                    icon={<GraduationCap size={18} />}
                    title="تحصیلات"
                    value={job.education}
                  />

                  <Info
                    icon={<BriefcaseBusiness size={18} />}
                    title="سابقه"
                    value={job.experience}
                  />

                  <Info
                    icon={<Users size={18} />}
                    title="ظرفیت"
                    value={`${job.positions} نفر`}
                  />

                  <Info
                    icon={<MapPin size={18} />}
                    title="موقعیت"
                    value={job?.address}
                  />
                  <Info
                    icon={<MapPin size={18} />}
                    title="موقعیت"
                    value={<Map lat={lat} lng={lng} />}
                  />
                </div>

                <Separator className="my-8" />

                <div>
                  <h2 className="text-xl font-semibold mb-4">توضیحات شغل</h2>

                  <p className="leading-8 text-muted-foreground whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}

          <div>
            <Card className="rounded-2xl shadow-sm sticky top-6">
              <CardHeader>
                <CardTitle>اطلاعات شرکت</CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <Building2 className="text-blue-600" />

                  <div>
                    <p className="text-sm text-muted-foreground">شرکت</p>

                    <p className="font-medium">{job.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-blue-600" />

                  <div>
                    <p className="text-sm text-muted-foreground">ایمیل</p>

                    <p className="break-all font-medium">{job.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3 className="text-blue-600" />

                  <div>
                    <p className="text-sm text-muted-foreground">
                      تاریخ انتشار
                    </p>

                    <p className="font-medium">
                      {new Date(job.created_at).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HistoryIcon className="text-blue-600" />

                  <div>
                    <p className="text-sm text-muted-foreground">آخرین مهلت</p>

                    <p className="font-medium">
                      {new Date(job.last_date).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                </div>
                <div>
                    <Candidates candidates={candidates}/>

                </div>
                <Separator />
                <Suspense fallback={<div>در حال بارگذاری...</div>}>
                  <JobInteraction id={id} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

type InfoProps = {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
};

function Info({ icon, title, value }: InfoProps) {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center gap-2 text-blue-600 mb-2">
        {icon}
        <span className="font-medium">{title}</span>
      </div>

      <p className="text-muted-foreground">{value}</p>
    </div>
  );
}
