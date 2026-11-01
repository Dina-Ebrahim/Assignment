import { ipKeyGenerator, rateLimit } from "express-rate-limit";

import geoip from "geoip-lite";
import { client } from "../../DB/radis.connection.js";
import { successResponse } from "./success.response.js";

var corsOptions = {
  origin: function (origin, callback) {},
};
function fromWhare(ip) {
  try {
    return geoip.lookup(ip);
  } catch (error) {}
}
const isLocal = (ip) =>
  ip === "::1" || ip === "127.0.0.1" || ip === "::ffff:127.0.0.1";
export const generateLimiter = ({
  ttl = 15,
  message = "TOO MANY REQUEST",
  status = 429,
  skipSuccessfulRequests,
  legacyHeaders = true,
  standardHeaders = "draft-8",
  limit = 1000,
}) => {
  return rateLimit({
    windowMs: ttl * 60 * 1000,
    limit: function (req) {
      if (process.env.NODE_ENV !== "production" && isLocal(req.ip))
        return limit;
      const geo = geoip.lookup(req.ip);
      if (!geo) return limit;
      return geo.country === "EG" ? limit : 0;
    },
    skipSuccessfulRequests,
    legacyHeaders,
    standardHeaders,
    handler: function (req, res, next) {
      return successResponse({ res, message, status });
    },
    keyGenerator: function (req) {
      const ip = ipKeyGenerator(req.ip, 52);
      console.log(req.ip, req.path, geoip.lookup(req.ip));
      return `${ip}::${req.path}`;
    },
    store: {
      async increment(key) {
        const totalHits = await client.incr(key);
        if (totalHits === 1) await client.expire(key, ttl * 60);
        const remaining = await client.ttl(key);
        return {
          totalHits,
          resetTime: new Date(Date.now() + Math.max(remaining, 0) * 1000),
        };
      },
      async decrement(key) {
        if (await client.exists(key)) await client.decr(key);
      },
      async resetKey(key) {
        await client.del(key);
      },
    },
  });
};
