import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const url = `https://systems.prowebventures.com/login.php?username=${encodeURIComponent(
      email
    )}&password=${encodeURIComponent(password)}`;

    const response = await fetch(url, { cache: "no-store" });
    const phpData = await response.json();

    // ✅ NORMALIZE ok (handles true, 1, "1")
    const ok =
      phpData?.ok === true ||
      phpData?.ok === 1 ||
      phpData?.ok === "1";

    return NextResponse.json({
      success: ok, // ✅ NOW MATCHES REAL LOGIN STATUS
      message: ok ? "Login success" : "Invalid credentials",
      data: phpData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}
