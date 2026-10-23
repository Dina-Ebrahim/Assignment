import { EmailSubjectEnum } from "../../enum/index.js";

export const templates = {
  [EmailSubjectEnum.CONFIRM_EMAIL]: (data) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f5fb; font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
    style="background-color:#f4f5fb; padding:35px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
          style="max-width:560px; background-color:#ffffff; border-radius:22px; overflow:hidden;">

          <tr>
            <td align="center"
              style="background-color:#dfeaff; padding:38px 25px 30px;">

              <div style="font-size:36px; line-height:1.4;">💌</div>

              <h1 style="margin:14px 0 8px; color:#334d80; font-size:27px;">
                You're Almost There!
              </h1>

              <p style="margin:0; color:#62749a; font-size:15px; line-height:1.8;">
                One little step to make your account official ♡
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:35px 30px 25px;">

              <p style="margin:0 0 25px; color:#6c7285; font-size:15px; line-height:1.9;">
                We're so happy you're here! 🌷
                Please confirm your email address using the verification code below
                to finish setting up your account.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center"
                    style="background-color:#f0edff; border:1px dashed #b7a7ed;
                    border-radius:16px; padding:25px 15px;">

                    <p style="margin:0 0 12px; color:#7666a9; font-size:12px;
                      font-weight:bold; letter-spacing:2px;">
                      YOUR VERIFICATION CODE
                    </p>

                    <div style="font-size:34px; font-weight:bold; letter-spacing:8px;
                      color:#6551a5; line-height:1.5;">
                      ${data.code}
                    </div>

                    <p style="margin:12px 0 0; color:#8a80aa; font-size:12px;">
                      Enter this code on the verification page.
                    </p>

                  </td>
                </tr>
              </table>

              <p style="margin:25px 0 0; color:#777d8e; font-size:13px; line-height:1.9;">
                For your security, please don't share this code with anyone.
                If you didn't create an account, you can safely ignore this email.
              </p>

              <p style="margin:25px 0 0; color:#555d73; font-size:15px; line-height:1.8;">
                With love and care, ♡<br>
                <strong style="color:#6551a5;">The Support Team</strong>
              </p>

            </td>
          </tr>

          <tr>
            <td align="center"
              style="background-color:#faf9ff; padding:22px 20px;">

              <p style="margin:0 0 8px; color:#a19ab7; font-size:12px;">
                Made with ♡ just for you
              </p>

              <p style="margin:0; color:#aaaabd; font-size:11px; line-height:1.7;">
                This is an automated email. Please do not reply to this message.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `;
  },

  [EmailSubjectEnum.FORGET_PASSWORD]: (data) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f5fb; font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
    style="background-color:#f4f5fb; padding:35px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
          style="max-width:560px; background-color:#ffffff; border-radius:22px; overflow:hidden;">

          <tr>
            <td align="center"
              style="background-color:#dfeaff; padding:38px 25px 30px;">

              <div style="font-size:36px;">🔐</div>

              <h1 style="margin:14px 0 8px; color:#334d80; font-size:27px;">
                Forgot Your Password?
              </h1>

              <p style="margin:0; color:#62749a; font-size:15px; line-height:1.8;">
                Don't worry, we're here to help ♡
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:35px 30px;">

              <p style="margin:0 0 25px; color:#6c7285; font-size:15px; line-height:1.9;">
                We received a request to reset your password.
                Use the verification code below to continue resetting it.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center"
                    style="background-color:#f0edff; border:1px dashed #b7a7ed;
                    border-radius:16px; padding:25px 15px;">

                    <p style="margin:0 0 12px; color:#7666a9; font-size:12px;
                      font-weight:bold; letter-spacing:2px;">
                      YOUR RESET CODE
                    </p>

                    <div style="font-size:34px; font-weight:bold; letter-spacing:8px;
                      color:#6551a5; line-height:1.5;">
                      ${data.code}
                    </div>

                  </td>
                </tr>
              </table>

              <p style="margin:25px 0 0; color:#777d8e; font-size:13px; line-height:1.9;">
                If you didn't request a password reset, please ignore this email
                and make sure your account is secure.
              </p>

              <p style="margin:25px 0 0; color:#555d73; font-size:15px; line-height:1.8;">
                With care, ♡<br>
                <strong style="color:#6551a5;">The Support Team</strong>
              </p>

            </td>
          </tr>

          <tr>
            <td align="center"
              style="background-color:#faf9ff; padding:22px 20px;">

              <p style="margin:0 0 8px; color:#a19ab7; font-size:12px;">
                Made with ♡ just for you
              </p>

              <p style="margin:0; color:#aaaabd; font-size:11px; line-height:1.7;">
                This is an automated email. Please do not reply to this message.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `;
  },
};

export const verifyEmailTemplate = (data) => {
  const template = templates[data.subject];

  if (!template) {
    throw new Error(`Email template "${data.subject}" does not exist`);
  }

  return template(data);
};
