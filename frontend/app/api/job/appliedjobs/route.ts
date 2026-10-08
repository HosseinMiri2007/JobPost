import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const cookiesstore = await cookies();
    const access = cookiesstore.get("access")?.value;
    if (!access) {
      console.log("where is you access ?");
    }
    const res = await axios.get(`${process.env.API_URL}/api/job/me/apply`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (res.data) {
      console.log(res.data);
      return NextResponse.json(res.data);
    } else {
      return NextResponse.json(
        {
          error: "به هیچ شغلی درخواست نکردید",
        },
        {
          status: res.status,
        },
      );
    }
  } catch (error) {
    console.log("خطا در دریافت شغل ها \n", error);
    if (axios.isAxiosError(error)) {
      console.log("خطا در دریافت شغل ها توسط axios \n", error);
    }
  }
}
