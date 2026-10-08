import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookiestore = await cookies();
    const access = cookiestore.get("access")?.value;
    if (!access) {
      return NextResponse.json(
        { error: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 },
      );
    }
    if (!id) {
      console.log("no id reached the route.ts in isapplied");
    }
    const res = await axios.get(
      `${process.env.API_URL}/api/job/me/check/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      },
    );
    return NextResponse.json(res.data);
  } catch (error) {
    console.log(error);
    // if (axios.isAxiosError(error)) {
    //   return NextResponse.json(
    //     {
    //       error:
    //         error.response?.data?.error ||
    //         "خطا در ارسال رزومه به شغل از سمت axios",
    //     },
    //     { status: error.response?.status || 500 },
    //   );
    // }

    return NextResponse.json({ error: "خطای ناشناخته" }, { status: 500 });
  }
}
