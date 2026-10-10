import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function DELETE(
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

    const cookiestore = await cookies();
    const access = cookiestore.get("access")?.value;

    if (!access) {
      return NextResponse.json(
        { error: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 },
      );
    }

    const res = await axios.delete(
      `${process.env.API_URL}/api/job/delete/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      },
    );

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("خطا در حذف شغل : ", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.response?.data?.error || "خطا حذف شغل از سمت axios",
        },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json({ error: "خطای ناشناخته" }, { status: 500 });
  }
}
