import { ProviderEnum } from "../../common/enum/user.gender.js";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  TooManyRequestException,
} from "../../common/exception/index.js";
import { findOne, createOne } from "../../common/repository/index.js";
import {
  compare,
  createLoginCredntials,
  createToken,
  decryption,
  encryption,
  hash,
  userBaseRevokeToken,
} from "../../common/security/index.js";
import {
  emailEvent,
  UserEmailKey,
  UserEmailTrialKey,
} from "../../common/utils/email/index.js";
import { WEB_CLIENT_IDS } from "../../config.js";
import { EmailSubjectEnum } from "../../common/enum/index.js";
import { UserModel } from "../../DB/model/index.js";
import { createOTP } from "../../common/utils/otp.js";
import {
  del,
  expire,
  get,
  incBy,
  keys,
  set,
  ttl,
} from "../../common/services/cache.service.js";
export const signup = async ({ email, password, username, phone }) => {
  const dublicate = await findOne({
    model: UserModel,
    filter: { email },
    options: { select: "email" },
  });
  if (dublicate) throw ConflictException("email already exist");

  const account = await createOne({
    model: UserModel,
    data: {
      email,
      password: await hash(password),
      username,
      phone: await encryption(phone),
    },
  });
  await sendEmailOtp({ email: email, subject: EmailSubjectEnum.CONFIRM_EMAIL });
  return account;
};
import { OAuth2Client } from "google-auth-library";
import { trusted } from "mongoose";
import { promise } from "zod";

const client = new OAuth2Client();
async function verifyGoogleAccount(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: WEB_CLIENT_IDS,
  });
  const payload = ticket.getPayload();
  if (!payload.email_verified) {
    throw BadRequestException("email not verified");
  }
  return payload;
}

export const signupWithGmail = async ({ idToken }, issuer) => {
  const { name, email, picture } = await verifyGoogleAccount(idToken);
  const existaccount = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (existaccount) {
    if (existaccount.provider !== ProviderEnum.GOOGLE) {
      throw ConflictException("Invaild Account Provider");
    }
    return {
      status: 200,
      data: await createLoginCredntials({
        user: existaccount,
        issuer,
      }),
    };
  }

  try {
    const addUser = await createOne({
      model: UserModel,
      data: {
        username: name,
        email,
        image: picture,
        provider: ProviderEnum.GOOGLE,
        confirmEmail: new Date(),
      },
    });
    return {
      status: 201,
      data: await createLoginCredntials({
        user: addUser,
        issuer,
      }),
    };
  } catch (error) {
    throw error;
  }
};

const sendEmailOtp = async ({
  email,
  subject,
  expiresIN = 120,
  maxTrials = 3,
  blockInsec = 300,
}) => {
  const existOTP_TTL = await ttl({ key: UserEmailKey({ email, subject }) });
  if (existOTP_TTL > 0) {
    throw ConflictException({
      message: "sorry can not send OTP while existing one still valid",
    });
  }
  const oldTrail = await get({ key: UserEmailTrialKey({ email, subject }) });
  if (oldTrail >= maxTrials) {
    throw TooManyRequestException({
      message: "Max otp trails has been reached",
    });
  }
  const code = createOTP();
  await set({
    key: UserEmailKey({
      email: email,
      subject,
    }),
    value: await hash(code.toString()),
    ttl: expiresIN,
  });
  const currentTrail = await incBy({
    key: UserEmailTrialKey({ email, subject }),
  });
  if (currentTrail == 3) {
    await expire({
      key: UserEmailTrialKey({ email, subject }),
      ttl: blockInsec,
    });
  }
  emailEvent.emit("sendEmail", {
    recipient: email,
    subject,
    message: {
      templateName: subject,
      code: code,
    },
  });
};
export const login = async ({ email, password }, issuer) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });
  if (!account) {
    throw NotFoundException("Not Exits");
  }

  const match = await compare(password, account.password);
  if (!match) {
    throw NotFoundException("Not Exits");
  }
  account.phone = await decryption(account.phone);

  return await createLoginCredntials({ user: account, issuer }); // to create access and refresh token for the user
};

export const confirmEmail = async ({ email, otp }) => {
  const dublicate = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: false },
    },
  });

  if (!dublicate) {
    throw NotFoundException("invalid account");
  }

  const hashOTP = await get({
    key: UserEmailKey({
      email,
      subject: EmailSubjectEnum.CONFIRM_EMAIL,
    }),
  });

  if (!hashOTP) {
    throw ConflictException({ message: "OTP not found or expired" });
  }

  const isOTPValid = await compare(otp, hashOTP);

  if (!isOTPValid) {
    throw ConflictException({ message: "invalid OTP" });
  }

  dublicate.confirmEmail = new Date();
  await dublicate.save();
  await del({
    key: await keys({
      prefix: UserEmailKey({
        email: email,
        subject: EmailSubjectEnum.CONFIRM_EMAIL,
      }),
    }),
  });
  return;
};

export const resendConfirmEmail = async ({ email }) => {
  const dublicate = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: false },
    },
  });

  if (!dublicate) {
    throw NotFoundException("invalid account");
  }

  await sendEmailOtp({ email: email, subject: EmailSubjectEnum.CONFIRM_EMAIL });
  return;
};

export const requestForForgetPassword = async ({ email }) => {
  const dublicate = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });

  if (!dublicate) {
    throw NotFoundException("invalid account");
  }

  await sendEmailOtp({
    email: email,
    subject: EmailSubjectEnum.FORGET_PASSWORD,
  });
  return dublicate;
};

export const verifyForgotPassword = async ({ email, otp }) => {
  const dublicate = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });
  if (!dublicate) {
    throw NotFoundException("invalid account");
  }
  const hashOTP = await get({
    key: UserEmailKey({
      email,
      subject: EmailSubjectEnum.FORGET_PASSWORD,
    }),
  });

  if (!hashOTP) {
    throw ConflictException({ message: "OTP not found or expired" });
  }

  const isOTPValid = await compare(otp, hashOTP);

  if (!isOTPValid) {
    throw ConflictException({ message: "invalid OTP" });
  }

  return dublicate;
};

export const resetForgotPassword = async ({ email, otp, password }) => {
  const account = await verifyForgotPassword({ email, otp });
  account.password = await hash(password);
  account.changeCredentialsTime = new Date();
  await account.save();

  const result = await Promise.all([
    keys({ prefix: userBaseRevokeToken({ user_id: account._id }) }),
    keys({
      prefix: UserEmailKey({
        email,
        subject: EmailSubjectEnum.FORGET_PASSWORD,
      }),
    }),
  ]);
  await del({
    key: [...result[0], ...result[1]],
  });
  return;
};
