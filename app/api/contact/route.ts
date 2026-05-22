import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Submit to Formspree
    const FORMSPREE_FORM_ID = process.env.FORMSPREE_FORM_ID;

    console.log("FORMSPREE_FORM_ID value:", FORMSPREE_FORM_ID);

    if (!FORMSPREE_FORM_ID || FORMSPREE_FORM_ID === "YOUR_FORMSPREE_FORM_ID") {
      console.error("FORMSPREE_FORM_ID is not configured in .env.local");
      return NextResponse.json(
        { success: false, error: "Form service not configured. Please contact the site administrator." },
        { status: 500 }
      );
    }

    const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        _replyto: email,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Formspree error:", errorText);
      return NextResponse.json(
        { success: false, error: "Failed to submit form" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit form. Please try again." },
      { status: 500 }
    );
  }
}
