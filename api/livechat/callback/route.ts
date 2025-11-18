import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const clientId = process.env.LIVECHAT_CLIENT_ID!;
    const clientSecret = process.env.LIVECHAT_CLIENT_SECRET!;
    const redirectUri = process.env.LIVECHAT_REDIRECT_URI!;

    const tokenResponse = await fetch("https://accounts.livechat.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/chat?access_token=${tokenData.access_token}`
    );
  } catch (error) {
    return NextResponse.json({ error: "OAuth error", details: String(error) });
  }
}

