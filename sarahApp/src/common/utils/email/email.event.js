import { EventEmitter } from "node:events";
import { sendEmail } from "./send.email.js";
import { verifyEmailTemplate } from "./email.template.js";

export const emailEvent = new EventEmitter();

emailEvent.on("sendEmail", async ({ recipient, subject, message }) => {
  try {
    await sendEmail({
      to: recipient,
      subject,
      html: verifyEmailTemplate({
        subject: message.templateName,
        code: message.code,
      }),
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
});
