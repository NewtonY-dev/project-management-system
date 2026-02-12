import express from "express";
import { uploadDocument, getTaskDocuments, downloadDocument, deleteDocument } from "../controllers/documentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload, handleMulterError } from "../config/multerConfig.js";
import { validateTaskId, validateDocumentId } from "../middleware/documentValidation.js";
import { ensureUploadsDirectory } from "../utils/fileUtils.js";
import { logInfo } from "../utils/logger.js";

const router = express.Router();

// Ensure uploads directory exists
ensureUploadsDirectory();

// Routes
router.post("/:taskId/documents", 
  authMiddleware, 
  validateTaskId,
  upload.single('file'), 
  handleMulterError,
  uploadDocument
);

router.get("/:taskId/documents", authMiddleware, validateTaskId, getTaskDocuments);

router.get("/:documentId/download", validateDocumentId, downloadDocument);

router.delete("/:documentId", authMiddleware, validateDocumentId, deleteDocument);

export default router;
