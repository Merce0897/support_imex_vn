import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

type ResponseData = {
  message: string;
};
export async function POST(request: Request) {
  console.log(await request.json());

  return NextResponse.json({ message: "HELLO FROM VINH" }, { status: 200 });
}
