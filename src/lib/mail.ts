import nodemailer from "nodemailer";

export async function sendOTPEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Ya aapka SMTP provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"TaxPortal India" <no-reply@taxportal.com>',
    to: email,
    subject: "Verify your account - OTP",
    html: `<h1>Welcome!</h1><p>Your OTP for registration is: <b>${otp}</b></p><p>Valid for 10 minutes.</p>`,
  });
}