import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send Email / OTP Helper
 * @param {string} to - Recipient email address
 * @param {string|number} content - OTP code OR HTML email string
 * @param {string} [subject] - Optional custom email subject
 */
const sendMail = async (to, content, subject) => {
  try {
    const isOtp = typeof content === "number" || (typeof content === "string" && content.length <= 8 && !content.includes("<"));

    const emailSubject = subject || (isOtp ? "Password Reset OTP - Virtual Courses" : "Virtual Courses Notification");

    const emailHtml = isOtp
      ? `
      <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;padding:20px;border:1px solid #e5e5e5;border-radius:10px">
        <h2 style="color:#2563eb;text-align:center">Virtual Courses</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password or verify your identity.</p>
        <p>Use the OTP below to continue:</p>
        <div style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
          text-align:center;
          padding:18px;
          background:#f3f4f6;
          border-radius:8px;
          color:#1e293b;
          margin:20px 0;
        ">
          ${content}
        </div>
        <p>This OTP is valid for <b>5 minutes</b>.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <br/>
        <p>Regards,<br/><b>Virtual Courses Team</b></p>
      </div>
      `
      : content;

    const info = await transporter.sendMail({
      from: `"Virtual Courses" <${process.env.EMAIL}>`,
      to,
      subject: emailSubject,
      html: emailHtml,
    });

    console.log(`✅ Email sent successfully to ${to} (Message ID: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error("❌ Email Sending Error:", error.message);
    throw new Error("Unable to send email.");
  }
};

export default sendMail;