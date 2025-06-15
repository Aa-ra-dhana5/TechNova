import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (toEmail, token) => {
  const verificationLink = `http://localhost:5000/api/auth/verify/${token}`;
  const mailOptions = {
    from: `E-Commerce <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify Your Email",
    html: `
       <!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;font-family:sans-serif;">
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f7;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:30px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 0 10px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding:40px 30px;text-align:center;">
                <h2 style="color:#333333;margin-bottom:20px;">Welcome to Our Platform 👋</h2>
                <p style="color:#555555;font-size:16px;line-height:1.5;margin:0 0 30px;">
                  Thank you for signing up. Please verify your email address by clicking the button below:
                </p>
                <a href="${verificationLink}" target="_blank" style="display:inline-block;background-color:#4F46E5;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:16px;margin-top:20px;">
                  Verify Email
                </a>
                <p style="margin-top:30px;color:#888;font-size:13px;">
                  If you didn’t request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#f0f0f0;padding:20px;text-align:center;font-size:12px;color:#999;">
                &copy; ${new Date().getFullYear()} E-Commerce. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", toEmail);
  } catch (error) {
    console.error("Email sending error:", error.message);
    throw error;
  }
};
