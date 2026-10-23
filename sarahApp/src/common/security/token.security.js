import jwt from "jsonwebtoken";
import {
  ACCESS_USER_TOKEN_SECRET,
  REFRESH_USER_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  ACCESS_ADMIN_TOKEN_SECRET,
  REFRESH_ADMIN_TOKEN_SECRET,
} from "../../config.js";
import {
  BadException,
  NotFoundException,
  UnauthorizedException,
} from "../exception/index.js";
import { findById } from "../repository/index.js";
import { UserModel } from "../../DB/model/user.model.js";
import { RoleEnum, TokenTypeEnum } from "../enum/index.js";
import { randomUUID } from "node:crypto";
import { exist, set } from "../services/cache.service.js";
export const userBaseRevokeToken = ({ user_id }) => {
  return `User::${user_id.toString()}::RevokeToken`;
};
export const userRevokeToken = ({ user_id, jti }) => {
  return `${userBaseRevokeToken({ user_id })}::${jti}`;
};
export const createToken = async ({
  payload = {},
  options = {},
  secret = ACCESS_USER_TOKEN_SECRET,
} = {}) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = async ({
  token = "",

  secret = ACCESS_USER_TOKEN_SECRET,
} = {}) => {
  return jwt.verify(token, secret);
};

//to get the access and refresh token signature based on the role of the user
const getTokenSignatures = async ({ role = RoleEnum.USER } = {}) => {
  let signatures;
  switch (role) {
    case RoleEnum.ADMIN:
      signatures = {
        access: ACCESS_ADMIN_TOKEN_SECRET,
        refresh: REFRESH_ADMIN_TOKEN_SECRET,
      };
      break;
    default:
      signatures = {
        access: ACCESS_USER_TOKEN_SECRET,
        refresh: REFRESH_USER_TOKEN_SECRET,
      };
      break;
  }
  return signatures;
};

const getSignature = async ({
  tokenType = TokenTypeEnum.ACCESS,
  role = RoleEnum.USER,
} = {}) => {
  const signatures = await getTokenSignatures({ role });
  return tokenType == TokenTypeEnum.ACCESS
    ? signatures.access
    : signatures.refresh;
};

export const decodeToken = async ({
  authorization = "",
  tokenType = TokenTypeEnum.ACCESS,
} = {}) => {
  const decoded = jwt.decode(authorization);

  if (!decoded?.aud?.length) {
    throw BadException("missing token audience");
  }
  const payload = await verifyToken({
    token: authorization,
    secret: await getSignature({ tokenType, role: decoded?.aud[0] }),
  });

  if (!payload?.sub) {
    throw BadException("missing token payload");
  }
  if (
    await exist({
      key: userRevokeToken({ user_id: payload.sub, jti: payload.jti }),
    })
  ) {
    throw UnauthorizedException({ message: "Invalid login credentials" });
  }
  const user = await findById({ model: UserModel, id: payload.sub });
  if (!user) {
    throw NotFoundException("Invalid user Id");
  }
  if ((user.changeCredentialsTime?.getTime() ?? 0) > payload.iat * 1000) {
    throw UnauthorizedException({ message: "Invalid login credentials" });
  }
  return { payload, user };
};

export const createRevokeToken = async ({ payload }) => {
  const consumeTime = Math.ceil(Date.now() / 1000) - payload.iat;
  const refreshExpire = payload.iat - REFRESH_TOKEN_EXPIRES_IN;
  const ttl = refreshExpire - consumeTime;
  await set({
    key: userRevokeToken({ user_id: payload.sub, jti: payload.jti }),
    value: payload.jti,
    ttl: ttl,
  });
  return;
};
export const createLoginCredntials = async ({ user, issuer, options = {} }) => {
  const { access, refresh } = await getTokenSignatures({
    role: user.role,
  });
  const jwtid = randomUUID();
  const access_token = await createToken({
    payload: { sub: user._id },
    options: {
      ...options,
      issuer,
      audience: [user.role],
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      jwtid,
    },
    secret: access,
  });

  const refresh_token = await createToken({
    payload: { sub: user._id },
    options: {
      audience: [user.role],
      ...options,
      issuer,
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      jwtid,
    },
    secret: refresh,
  });

  return {
    access_token,
    refresh_token,
  };
};
