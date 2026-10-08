import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) {
    return NextResponse.json(
      {
        error: "Not authenticated",
      },
      {
        status: 401,
      },
    );
  }
  try {
    const response = await axios.get(`${process.env.API_URL}/api/me/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    if (response) {
      return NextResponse.json(response.data);
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }
}
