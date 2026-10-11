import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    // Add subscriber to the audience list
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      await resend.contacts.create({
        email,
        audienceId,
      });
    }

    // Send welcome email
    await resend.emails.send({
      from: "Elephant Invest <hallo@elephantinvest.de>",
      to: email,
      subject: "Welcome to Elephant Invest",
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #111;">
          <h1 style="font-size: 28px; font-weight: 500; margin-bottom: 16px;">You're in.</h1>
          <p style="font-size: 15px; line-height: 1.7; color: #444;">
            Welcome to the Elephant Invest newsletter. Every month, we share our latest insights
            on technology, fintech, and life sciences — and what's shaping the next generation of capital.
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #444; margin-top: 16px;">
            We'll be in touch soon.
          </p>
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
            © 2026 Elephant Invest · <a href="https://elephantinvest.de" style="color: #999;">elephantinvest.de</a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
