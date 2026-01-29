import nodemailer from "nodemailer";

export async function sendOTPEmail(email: string, otp: string) {
  // Check if env variables exist (Bina NEXT_PUBLIC ke)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Email environment variables are missing!");
    return { error: "Email configuration error" };
  }

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in", // Gmail की जगह अब यह आएगा
  port: 465,            // Zoho के लिए सुरक्षित पोर्ट
  secure: true,         // SSL के लिए true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

  try {
    // Connection verify karein
    await transporter.verify(); 

    const info = await transporter.sendMail({
      from: `"TaxAdhaar India" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your account - OTP",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #020617;">Welcome to TaxAdhaar!</h2>
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

export async function sendResetPasswordEmail(email: string, resetUrl: string) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Email environment variables are missing!");
    return { error: "Email configuration error" };
  }

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,            // 465 ही रखें
  secure: true,         // इसे true ही रहने दें
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // यह लाइन जोड़ें ताकि नेटवर्क फ्लक्चुएशन न हो
  connectionTimeout: 10000, 
});

  try {
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Taxadhaar Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - Taxadhaar",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #020617; font-weight: 900;">Reset Your Password</h2>
          <p style="color: #475569;">Aapne apna password reset karne ki request ki thi. Niche diye gaye button par click karke apna naya password set karein:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #94a3b8;">Ye link 1 ghante tak valid hai. Agar aapne ye request nahi ki thi, to is email ko ignore karein.</p>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
          <p style="font-size: 10px; color: #cbd5e1; text-align: center;">© 2026 Taxadhaar India - Secure Layer</p>
        </div>
      `,
    });

    console.log("✅ Reset Email sent: " + info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Reset Email Error:", error);
    return { error: "Failed to send reset email" };
  }
}