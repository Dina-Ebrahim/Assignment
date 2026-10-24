import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileTypeFromBuffer } from "file-type";
import { BadRequestException } from "../../exception/index.js";

export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/gif"],
  files: ["application/pdf", "application/json"],
};
export const localFileUpload = ({ maxFileSize = 5, validation = [] } = {}) => {
  const storage = multer.memoryStorage();
  return multer({
    storage,
    limits: { fileSize: maxFileSize * 1024 * 1024 },
  });
};
const validateFile = async ({ file, validation }) => {
  const result = await fileTypeFromBuffer(file.buffer);
  if (!result || !validation.includes(result.mime)) {
    throw BadRequestException("invalid file format");
  }
  return { file, ext: result.ext };
};
const getRequestFiles = (req) => {
  if (req.file) {
    return [req.file];
  }
  if (Array.isArray(req.files)) {
    return req.files;
  }
  if (req.files && typeof req.files === "object") {
    return Object.values(req.files).flat();
  }
  return [];
};

export const processMulterUplaod = async ({
  customPath = "general",
  validation,
  req,
}) => {
  const files = getRequestFiles(req);
  const validatedFiles = await Promise.all(
    files.map((file) => validateFile({ file, validation })),
  );
  const savedPaths = [];
  try {
    const uploaded = [];
    for (const item of validatedFiles) {
      await mkdir(`./assets/${customPath}`, {
        recursive: true,
      });
      const filePath = resolve(
        `./assets/${customPath}/${randomUUID()}.${item.ext}`,
      );
      savedPaths.push(filePath);
      await writeFile(filePath, item.file.buffer);
      item.file.finalPath = filePath;
      uploaded.push(item.file);
    }
    return uploaded;
  } catch (error) {
    await Promise.all(savedPaths.map((path) => unlink(path).catch(() => {})));
    throw error;
  }
};
export const uploadMiddleware = ({
  isRequired = true,
  multerMiddleware,
  customPath = "general",
  validation = [],
}) => {
  return (req, res, next) => {
    multerMiddleware(req, res, async (error) => {
      if (error) {
        next(new Error(error.message, { cause: { status: 400 } }));
        return;
      }

      try {
        if (
          isRequired &&
          !req.file &&
          !(Array.isArray(req.files) && req.files.length) &&
          !(typeof req.files == "object" && Object.keys(req.files)?.length)
        ) {
          next(BadRequestException({ message: "file is required" }));
          return;
        }
        await processMulterUplaod({ customPath, validation, req });
        next();
      } catch (error) {
        next(new Error(error.message, { cause: { status: 400 } }));
      }
    });
  };
};

// export const processFile = async ({
//   customPath = "general",
//   file,
//   validation,
// }) => {
//   const result = await fileTypeFromBuffer(file.buffer);
//   if (!result || !validation.includes(result.mime)) {
//     throw BadRequestException("invalid file format");
//   } else {
//     await mkdir(`./assets/${customPath}`, { recursive: true });
//     const uniqueFilePath = `./assets/${customPath}/${randomUUID()}.${result.ext}`;
//     await writeFile(resolve(`${uniqueFilePath}`), file.buffer);
//     file.finalPath = uniqueFilePath;
//   }
//   return file;
// };
// export const processFiles = async ({ customPath, files = [], validation }) => {
//   const uploaded = [];
//   for (const file of files) {
//     const uploadFile = await processFile({ file, validation, customPath });
//     uploaded.push(uploadFile);
//   }
//   return uploaded;
// };
// export const processFields = async ({
//   customPath,
//   fields = {},
//   validation,
// }) => {
//   const uploaded = [];
//   for (const field of Object.keys(fields)) {
//     await processFiles({ files: fields[field], validation, customPath });
//     uploaded.push({ field, files });
//   }
//   return uploaded;
// };
