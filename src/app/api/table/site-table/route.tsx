import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://aisaasbuilder.app/api/siteList", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 🔐 Send token in header
        Authorization: `Bearer ${process.env.AISAAS_API_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: "Failed to fetch site list", details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}

/* DELETE: call external API to delete site */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Invoice/Site id is required" },
        { status: 400 }
      );
    }

    // Call your external delete API
    const res = await fetch(`https://aisaasbuilder.app/api/deletesite/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AISAAS_API_TOKEN}`,
      }
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { message: "Failed to delete site", details: text },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, message: "Site deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}