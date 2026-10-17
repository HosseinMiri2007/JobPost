import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "شناسه شغل ارسال نشده است" },
        { status: 400 },
      );
    }

    const cookie = await cookies();

    const access = cookie.get("access")?.value;

    if (!access) {
      return NextResponse.json(
        { error: "ارور ، توکن وجود نداره" },
        { status: 401 },
      );
    }

    const res = await axios.get(
      `${process.env.API_URL}/api/job/applied/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      },
    );

    return NextResponse.json(res.data, {
      status: res.status,
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
