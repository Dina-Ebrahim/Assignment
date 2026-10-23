import { TokenTypeEnum } from "../common/enum/security.enum.js";
import {
  ForbiddenException,
  UnauthorizedException,
} from "../common/exception/index.js";
import { decodeToken } from "../common/security/index.js";

export const authentication = (tokenType = TokenTypeEnum.ACCESS) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    console.log("AUTHORIZATION =", authorization);
    if (!authorization) {
      throw UnauthorizedException("Unauthorized Account");
    }
    const [prefix, token] = authorization.split(" ");
    if (prefix !== "Bearer" || !token) {
      throw UnauthorizedException("Invalid authorization header");
    }
    const { user, payload } = await decodeToken({
      authorization: token,
      tokenType,
    });
    req.user = user;
    req.payload = payload;
    next();
  };
};

export const authorization = (accessRole) => {
  return async (req, res, next) => {
    console.log("User role:", req.user.role);
    console.log("Required role:", accessRole);
    if (req.user.role < accessRole) {
      throw ForbiddenException(" Forbidden Account");
    }

    next();
  };
};
