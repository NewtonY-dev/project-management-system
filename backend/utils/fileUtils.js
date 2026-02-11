import path from 'path';
import fs from 'fs';
import { logInfo, logWarn } from './logger.js';

// File path constants
export const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'tasks');

// Ensure uploads directory exists
export const ensureUploadsDirectory = () => {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    logInfo('Uploads directory created', { path: UPLOADS_DIR });
  } else {
    logInfo('Uploads directory already exists', { path: UPLOADS_DIR });
  }
};

// Sanitize filename for safe storage
export const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
};

// Generate unique filename
export const generateUniqueFilename = (originalName) => {
  const sanitizedOriginalName = sanitizeFilename(originalName);
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${sanitizedOriginalName}`;
};

// Get full file path
export const getFilePath = (filename) => {
  return path.join(UPLOADS_DIR, filename);
};

// Check if file exists
export const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

// Delete file from disk
export const deleteFile = (filePath) => {
  if (fileExists(filePath)) {
    fs.unlinkSync(filePath);
    logInfo('File deleted from disk', { filePath });
    return true;
  } else {
    logWarn('File not found on disk during delete', { filePath });
    return false;
  }
};

// Validate file size
export const validateFileSize = (size, maxSize) => {
  return size <= maxSize;
};

// Validate file type
export const validateFileType = (mimetype, allowedTypes) => {
  return allowedTypes.includes(mimetype);
};
