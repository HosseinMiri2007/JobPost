import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { toast } from "react-toastify";

export async function GET(req: NextRequest) {
  try {
    const cookiestore = await cookies();
    const access = cookiestore.get("access")?.value;

    if (!access) {
      toast.error("شما مجاز به انجام عملیات نیستید لطفا ثبت نام/ورود کنید");
    }

    const res = await axios.get(`${process.env.API_URL}/api/job/me/jobs`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("خطای دریافت شغل های کاربر فعلی : ", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error:
            error.response?.data?.error || "خطا در دریافت شغل های کاربرaxios",
        },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json({ error: "خطای ناشناخته" }, { status: 500 });
  }
}
