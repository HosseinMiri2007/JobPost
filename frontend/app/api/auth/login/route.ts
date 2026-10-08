import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  try {
    const response = await axios.post(`${process.env.API_URL}/api/token/`, {
      username,
      password,
    });

    const res = NextResponse.json({
      success: true,
    });

    res.cookies.set("access", response.data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 15,
    });
    return res;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("Django returned:");
      console.log(err.response?.status);
      console.log(err.response?.data);

      return NextResponse.json(err.response?.data, {
        status: err.response?.status ?? 500,
      });
    }

    return NextResponse.json({ error: "خطای ناشناخته" }, { status: err.response.status });
  }
}
