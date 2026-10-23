export const ApplicationException = ({
  message = "error",
  status = 400,
  issues = undefined,
} = {}) => {
  console.log("ISSUES INSIDE EXCEPTION =", issues);

  const error = new Error(message);

  error.status = status;
  error.issues = issues;

  throw error;
};

export const BadRequestException = ({
  message = "BadRequestException",
  issues = undefined,
} = {}) => {
  return ApplicationException({
    message,
    status: 400,
    issues,
  });
};

export const ConflictException = ({
  message = "ConflictException",
  issues = undefined,
} = {}) => {
  return ApplicationException({
    message,
    status: 409,
    issues,
  });
};

export const TooManyRequestException = ({
  message = "Too Many Request Exception",
  issues = undefined,
} = {}) => {
  return ApplicationException({
    message,
    status: 429,
    issues,
  });
};

export const UnauthorizedException = ({
  message = "UnauthorizedException",
  issues = undefined,
} = {}) => {
  return ApplicationException({
    message,
    status: 401,
    issues,
  });
};

export const NotFoundException = ({
  message = "NotFoundException",
  issues = undefined,
} = {}) => {
  return ApplicationException({
    message,
    status: 404,
    issues,
  });
};

export const ForbiddenException = ({
  message = "ForbiddenException",
  issues = undefined,
} = {}) => {
  return ApplicationException({
    message,
    status: 403,
    issues,
  });
};

export const BadException = ({
  message = "Bad request exception",
  issues = undefined,
} = {}) => {
  return ApplicationException({
    message,
    status: 400,
    issues,
  });
};
