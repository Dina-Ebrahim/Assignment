import { UserModel } from "../../DB/model/index.js";

import { findByIdAndUpdate } from "../../common/repository/index.js";
import {
  compare,
  createLoginCredntials,
  createRevokeToken,
  userBaseRevokeToken,
} from "../../common/security/index.js";
import { ACCESS_TOKEN_EXPIRES_IN } from "../../config.js";
import {
  BadRequestException,
  ConflictException,
} from "../../common/exception/error.excption.js";
import { del, get, keys, set } from "../../common/services/index.js";
import { logoutEnum } from "../../common/enum/security.enum.js";
import { sendEmailOtp } from "../authentication/authentication.service.js";
import { EmailSubjectEnum } from "../../common/enum/email.enum.js";
import { UserEmailKey } from "../../common/utils/email/send.email.js";

const PROFILE_CACHE_TTL = 300;
export const userProfileCacheKey = (userId) =>
  `User::${userId.toString()}::Profile`;
export const profile = async (user) => {
  const key = userProfileCacheKey(user._id);
  const cacheProfile = await get({ key: key });
  if (cacheProfile !== null && cacheProfile !== undefined) {
    return cacheProfile;
  }
  const profileData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  await set({ key: key, value: profileData, ttl: PROFILE_CACHE_TTL });
  return profileData;
};
export const updateProfile = async (user, data) => {
  const updatedUser = await findByIdAndUpdate({
    model: UserModel,
    id: user._id,
    update: data,
  });
  await del({
    key: userProfileCacheKey(user._id),
  });
  return updatedUser;
};
export const rotateToken = async (payload, user, issuer) => {
  const accessExpiresIn = (payload.iat + ACCESS_TOKEN_EXPIRES_IN) * 1000;
  const currentTime = Date.now() + 30 * 60000;
  if (currentTime < accessExpiresIn) {
    throw ConflictException(
      "sorry we cannot create new login credintials while current access token still within vaild time range",
    );
  }
  const data = await createLoginCredntials({ user, issuer });
  await createRevokeToken({ payload });
  return data;
};

export const logOut = async (payload, user, { action }) => {
  switch (action) {
    case logoutEnum.ALL:
      user.changeCredentialsTime = new Date();
      await user.save();
      const revokeKeys = await keys({
        prefix: userBaseRevokeToken({ user_id: payload.sub }),
      });

      if (revokeKeys.length > 0) {
        await del({ key: revokeKeys });
      }
      break;
    default:
      return createRevokeToken({ payload });
  }
};
export const enableTwoFactor = async ({ user }) => {
  if (user.twoFactorEnabled) {
    throw ConflictException({
      message: "Two-factor authentication is already enabled",
    });
  }
  if (!user.confirmEmail) {
    throw BadRequestException({ message: "Please confirm your email first" });
  }
  await sendEmailOtp({
    email: user.email,
    subject: EmailSubjectEnum.ENABLE_2FA,
  });
  return {
    message: "OTP sent to your email",
  };
};
export const confirmTwoFactor = async ({ user, otp }) => {
  if (user.twoFactorEnabled) {
    throw ConflictException("Two-factor authentication is already enabled");
  }
  const key = UserEmailKey({
    email: user.email,
    subject: EmailSubjectEnum.ENABLE_2FA,
  });
  const hashedOTP = await get({ key });
  if (!hashedOTP) {
    throw ConflictException("OTP not found or expired");
  }

  const isValid = await compare(otp, hashedOTP);

  if (!isValid) {
    throw BadRequestException("Invalid OTP");
  }
  user.twoFactorEnabled = true;
  user.twoFactorEnabledAt = new Date();
  await user.save();

  await del({ key });

  return {
    message: "Two-factor authentication enabled successfully",
  };
};
