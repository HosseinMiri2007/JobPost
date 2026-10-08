import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    // Get access token
    const cookiestore = await cookies();
    const access = cookiestore.get("access")?.value;

    if (!access) {
      return NextResponse.json(
        { error: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 },
      );
    }

    // Get the file from the request
    const formData = await req.formData();
    const resume = formData.get("resume");

    // Check if file exists
    if (!resume) {
      return NextResponse.json(
        { error: "لطفا یک فایل انتخاب کنید" },
        { status: 400 },
      );
    }

    // Create FormData for Django
    const backendFormData = new FormData();
    // Use 'as File' to tell TypeScript this is a file
    backendFormData.append("resume", resume as File);

    // Send to Django
    const response = await axios.put(
      `${process.env.API_URL}/api/upload/resume/`,
      backendFormData,
      {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Upload error:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || "خطا در آپلود" },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json({ error: "خطای ناشناخته" }, { status: 500 });
  }
}
