import { RegisterUserType, UserType } from "@/types/auth_types";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { toast } from "react-toastify";

export async function POST(req: NextRequest) {
  try {
    const { first_name, last_name, email, password } = await req.json();

    const res = await axios.post(`${process.env.API_URL}/api/register/`, {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
    });

    if (res.status === 200) {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.log(error);
  }
}
