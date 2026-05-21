"use server";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return { success: false, error: "All fields are required" };
  }

  // Submit to Formspree
  // Get your form ID from https://formspree.io/
  const FORMSPREE_FORM_ID = process.env.FORMSPREE_FORM_ID || "YOUR_FORMSPREE_FORM_ID";

  try {
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
      throw new Error("Failed to submit form");
    }

    return { success: true };
  } catch (error) {
    console.error("Form submission error:", error);
    return { success: false, error: "Failed to submit form. Please try again." };
  }
}
