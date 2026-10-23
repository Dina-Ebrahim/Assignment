import { UserModel } from "../../DB/model/index.js";

import { findByIdAndUpdate } from "../../common/repository/index.js";
import {
  createLoginCredntials,
  createRevokeToken,
  userBaseRevokeToken,
  userRevokeToken,
} from "../../common/security/index.js";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../../config.js";
import { ConflictException } from "../../common/exception/error.excption.js";
import { del, get, keys, set } from "../../common/services/index.js";
import { logoutEnum } from "../../common/enum/security.enum.js";

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
