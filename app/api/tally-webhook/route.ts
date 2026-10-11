import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    // Tally sends form data in payload.data.fields
    const fields = payload?.data?.fields || [];
    
    // Find the email field — Tally uses field type "INPUT_EMAIL"
    const emailField = fields.find(
      (f: any) => f.type === "INPUT_EMAIL" || f.label?.toLowerCase().includes("email")
    );
    
    const email = emailField?.value;
    
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    // Send confirmation email
    await resend.emails.send({
      from: "Elephant Invest <hallo@elephantinvest.de>",
      to: email,
      subject: "Application Received — Elephant Invest",
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #111;">
          <h1 style="font-size: 28px; font-weight: 500; margin-bottom: 16px;">Application received.</h1>
          <p style="font-size: 15px; line-height: 1.7; color: #444;">
            Thank you for your interest in Elephant Invest. We've received your allocation application
            and our team will review it shortly.
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #444; margin-top: 16px;">
            If your profile meets our current allocation criteria, we'll be in touch within 5–7 business days
            with next steps.
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #444; margin-top: 16px;">
            In the meantime, feel free to explore our <a href="https://elephantinvest.de/portfolio" style="color: #111; font-weight: 500;">portfolio</a>
            and <a href="https://elephantinvest.de/manifesto" style="color: #111; font-weight: 500;">manifesto</a>.
          </p>
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
            © 2026 Elephant Invest · <a href="https://elephantinvest.de" style="color: #999;">elephantinvest.de</a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
