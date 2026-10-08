import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ topic: string }> },
) {
  const { topic } = await params;
  try {
    if (!topic) {
      console.log("topic is empty");
    }
    const res = await axios.get(
      `${process.env.API_URL}/api/job/stats/${topic}/`,
    );
    if (res.data) {
      console.log(
        "the data recieved on route.ts gettopicstats is : \n",
        res.data,
      );
      return NextResponse.json(res.data);
    } else {
      return NextResponse.json({ error: "موضوع موجود نیست" });
    }
  } catch (error) {
    console.log("we faced an error \n", error);
    if (axios.isAxiosError(error)) {
      console.log("axios error \n", error);
    }
    return NextResponse.json({ error: "unknown error" }, { status: 500 });
  }
}
