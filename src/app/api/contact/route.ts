import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Please fill in all fields (Name, Email, Message)." },
        { status: 400 }
      );
    }

    // Forward to FormSubmit to deliver to ayushdps2020@gmail.com
    try {
      await fetch("https://formsubmit.co/ajax/ayushdps2020@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Referer: "https://ayushdas27112007.vercel.app",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `New Portfolio Inquiry from ${name}`,
          _captcha: "false",
        }),
      });
    } catch (forwardErr) {
      console.warn("FormSubmit forward warning:", forwardErr);
    }

    return NextResponse.json({
      success: true,
      message: "Message received successfully!",
    });
  } catch (error: any) {
    console.error("Error in /api/contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process message." },
      { status: 500 }
    );
  }
}
