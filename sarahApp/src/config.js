import { resolve } from "node:path";
import { config } from "dotenv";
export const NODE_ENV = process.env.NODE_ENV ?? "development";
config({ path: resolve(`.env.${NODE_ENV}`) });

export const PORT = parseInt(process.env.PORT ?? "9000");
export const APPLICATION_NAME = process.env.APPLICATION_NAME;
export const DB_URI = process.env.DB_URI;
export const APP_EMAIL = process.env.APP_EMAIL;
export const APP_PASSWORD = process.env.APP_PASSWORD;
export const RADIS_URI = process.env.RADIS_URI;
export const SALT = parseInt(process.env.SALT ?? "12");
export const IV_LENGTH = parseInt(process.env.IV_LENGTH ?? "16");

export const ENC_KEY = process.env.ENC_KEY;
export const ACCESS_ADMIN_TOKEN_SECRET = process.env.ACCESS_ADMIN_TOKEN_SECRET;
export const ACCESS_USER_TOKEN_SECRET = process.env.ACCESS_USER_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRES_IN = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES_IN ?? "1800",
);

export const REFRESH_ADMIN_TOKEN_SECRET =
  process.env.REFRESH_ADMIN_TOKEN_SECRET;
export const REFRESH_USER_TOKEN_SECRET = process.env.REFRESH_USER_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRES_IN = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES_IN ?? "86400*365",
);
export const WEB_CLIENT_IDS = process.env.WEB_CLIENT_IDS?.split(",") ?? [];
