import nodemailer from "nodemailer";
import { APP_EMAIL, APP_PASSWORD, APPLICATION_NAME } from "../../../config.js";
import { BadRequestException } from "../../exception/error.excption.js";
export const UserEmailKey = ({ email, subject }) => {
  return `User::${email}::${subject}::OTP`;
};
export const UserEmailTrialKey = ({ email, subject }) => {
  return `${UserEmailKey({ email, subject })}::Trail`;
};
// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD,
  },
});
export const sendEmail = async ({
  to,
  cc,
  bcc, // list of recipients
  subject, // subject line
  text, // plain text body
  html, // HTML body
  attachments = [],
}) => {
  if (!to?.length && !cc?.length && !bcc?.length) {
    throw BadRequestException({ message: "Missing email recipients" });
  }
  if (!text?.length && !html?.length && !attachments?.length) {
    throw BadRequestException({ message: "Missing email content" });
  }
  try {
    const info = await transporter.sendMail({
      from: `"${APPLICATION_NAME}" <${APP_EMAIL}>`, // sender address
      to,
      cc,
      bcc, // list of recipients
      subject, // subject line
      text, // plain text body
      html, // HTML body
      attachments,
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};
