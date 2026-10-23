import { LanguageEnum } from "../common/enum/index.js";
import { BadException } from "../common/exception/error.excption.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const lang = Number(req.headers["accept-language"] ?? LanguageEnum.EN);
    const validationresult = schema(lang).safeParse({
      body: req.body,
      query: req.query,
      param: req.param,
    });
    console.log(validationresult);

    if (!validationresult.success) {
      throw BadException({
        message: "validation error",
        issues: validationresult.error.issues,
      });
    }
    req.validate = validationresult.data;
    next();
  };
};
