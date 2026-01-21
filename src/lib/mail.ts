import nodemailer from "nodemailer";

export async function sendOTPEmail(email: string, otp: string) {
  // Check if env variables exist (Bina NEXT_PUBLIC ke)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Email environment variables are missing!");
    return { error: "Email configuration error" };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL ke liye true
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Connection verify karein
    await transporter.verify(); 

    const info = await transporter.sendMail({
      from: `"TaxPortal India" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your account - OTP",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #020617;">Welcome to TaxPortal!</h2>
          <p>Apna account verify karne ke liye niche diya gaya OTP use karein:</p>
          <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #2563eb; border-radius: 8px;">
            ${otp}
          </div>
          <p style="margin-top: 20px; color: #64748b; font-size: 12px;">Ye code 10 minutes mein expire ho jayega.</p>
        </div>
      `,
    });

    console.log("✅ Email sent: " + info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Nodemailer Error:", error);
    return { error: "Email delivery failed" };
  }
}