import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { toast } from "react-toastify";

export async function POST(req: NextRequest) {
  const {
    title,
    industry,
    jobtime,
    education,
    experience,
    email,
    company,
    address,
    position,
    salary,
    description,
    created_at,
    last_date,
  } = await req.json();

  const newJobData = {
    title,
    industry,
    jobtime,
    education,
    experience,
    email,
    company,
    address,
    position,
    salary,
    description,
    created_at,
    last_date,
  };

  const cookiesstore = await cookies();

  const access = cookiesstore.get("access")?.value;

  if (!access) {
    toast.error("کاربر ثبت نام/ورود نکرده");
    console.log("کاربر ثبت نام/ورود نکرده");
  }

  const res = await axios.post(
    `${process.env.API_URL}/api/job/new/`,
    newJobData,
    {
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (res.data) {
    return NextResponse.json(res.data, { status: res.status });
  }
}
