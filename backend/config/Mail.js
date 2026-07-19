import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"Virtual Courses" <${process.env.EMAIL}>`,
      to,
      subject: "Password Reset OTP - Virtual Courses",
      html: `
      <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;padding:20px;border:1px solid #e5e5e5;border-radius:10px">
        
        <h2 style="color:#2563eb;text-align:center">
          Virtual Courses
        </h2>

        <p>Hello,</p>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Use the OTP below to continue:
        </p>

        <div style="
          font-size:30px;
          font-weight:bold;
          letter-spacing:8px;
          text-align:center;
          padding:18px;
          background:#f3f4f6;
          border-radius:8px;
          margin:20px 0;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for <b>5 minutes</b>.
        </p>

        <p>
          If you did not request a password reset,
          you can safely ignore this email.
        </p>

        <br/>

        <p>
          Regards,<br/>
          <b>Virtual Courses Team</b>
        </p>

      </div>
      `,
    });

    console.log("OTP Email Sent Successfully");
  } catch (error) {
    console.error("Email Sending Error:", error);
    throw new Error("Unable to send OTP email.");
  }
};

export default sendMail;