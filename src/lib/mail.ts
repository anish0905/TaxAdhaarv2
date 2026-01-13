import nodemailer from "nodemailer";

export async function sendOTPEmail(email: string, otp: string) {
  // Check if env variables exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Email environment variables are missing!");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify(); // Check connection before sending
    await transporter.sendMail({
      from: `"TaxPortal India" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your account - OTP",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #020617;">Welcome to TaxPortal!</h1>
          <p>Upyog karein niche diye gaye OTP ka apna account verify karne ke liye:</p>
          <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #2563eb; border-radius: 8px;">
            ${otp}
          </div>
          <p style="margin-top: 20px; color: #64748b; font-size: 12px;">Ye code 10 minutes mein expire ho jayega.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return { error: "Email bhejte waqt galti hui." };
  }
}