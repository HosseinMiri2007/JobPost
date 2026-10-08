import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function PUT(req: NextRequest) {
  try {
    const { first_name, last_name, email, username, password } =
      await req.json();
    const cookiestore = await cookies();
    const access = cookiestore.get("access")?.value;

    const res = await axios.put(
      `${process.env.API_URL}/api/me/update/`,
      { first_name, last_name, email, username, password },
      { headers: { Authorization: `Bearer ${access}` } },
    );

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
      return NextResponse.json(
        { error: error.response?.data ?? "Something went wrong" },
        { status: error.response?.status ?? 500 },
      );
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
