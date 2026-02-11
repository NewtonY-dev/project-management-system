import multer from "multer";
import { UPLOADS_DIR, generateUniqueFilename, sanitizeFilename } from "../utils/fileUtils.js";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE, ERROR_CODES, ERROR_MESSAGES } from "../constants/fileTypes.js";
import { logError, logInfo } from "../utils/logger.js";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = generateUniqueFilename(file.originalname);
    cb(null, uniqueFilename);
  }
});

// File filter for allowed MIME types
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    logError('Invalid file type', new Error('File type not allowed'), {
      mimetype: file.mimetype,
      originalname: file.originalname
    });
    cb(new Error(ERROR_MESSAGES[ERROR_CODES.DOC_UPLOAD_INVALID_TYPE]), false);
  }
};

// Multer configuration
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer
export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      logError('File size exceeded', error, { size: error.limit });
      return res.status(400).json({
        error: ERROR_MESSAGES[ERROR_CODES.DOC_UPLOAD_SIZE_EXCEEDED],
        code: ERROR_CODES.DOC_UPLOAD_SIZE_EXCEEDED
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: ERROR_MESSAGES[ERROR_CODES.DOC_UPLOAD_TOO_MANY_FILES],
        code: ERROR_CODES.DOC_UPLOAD_TOO_MANY_FILES
      });
    }
  }
  
  if (error.message.includes('File type not allowed')) {
    return res.status(400).json({
      error: error.message,
      code: ERROR_CODES.DOC_UPLOAD_INVALID_TYPE
    });
  }

  next(error);
};
