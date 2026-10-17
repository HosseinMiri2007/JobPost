import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AddJobType } from "@/types/job_types";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: "شناشه اشتباه" }, { status: 400 });
    }

    const cookiestore = await cookies();

    console.log("cookie store : ", cookiestore);
    console.log("access token : ", cookiestore.get("access")?.value);
    const access = cookiestore.get("access")?.value;

    if (!access) {
      return NextResponse.json(
        { message: "لطفاً وارد حساب کاربری خود شوید" },
        { status: 401 },
      );
    }

    const jobData = (await req.json()) as AddJobType;

    const backendUrl = `${process.env.API_URL}/api/job/update/${id}/`;

    console.log("[UPDATE JOB] Forwarding PUT request:", backendUrl);

    const response = await axios.put(backendUrl, jobData, {
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    });

    console.log("[UPDATE JOB] Backend status:", response.status);

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[UPDATE JOB] Backend request failed:", {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error("[UPDATE JOB] Unexpected error:", error);
    }

    return NextResponse.json(
      { message: "خطا در ویرایش آگهی" },
      { status: 500 },
    );
  }
}
