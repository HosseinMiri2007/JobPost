import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json({
      success: true,
    });

    res.cookies.set("access", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    console.log(res)
    return res;
  } catch (error) {
    console.log("به مشکل برخوردیم", error);
  }
}
