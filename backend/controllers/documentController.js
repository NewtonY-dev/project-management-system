import fs from "fs";
import path from "path";
import { checkDocumentPermissions, createDocument, getDocumentById, fetchTaskDocuments, getDocumentWithAuthor, deleteDocumentFromDatabase } from "../services/documentService.js";
import { getFilePath, deleteFile, fileExists } from "../utils/fileUtils.js";
import { logInfo, logError, logDebug } from "../utils/logger.js";
import { ERROR_CODES, ERROR_MESSAGES } from "../constants/fileTypes.js";
import { sendErrorResponse, sendSuccessResponse } from "../middleware/documentValidation.js";

// Upload document to task
export const uploadDocument = async (req, res) => {
  const { taskId } = req;
  const userId = req.user.id;

  try {
    // Check permissions
    const permissions = await checkDocumentPermissions(taskId, userId);
    
    if (!permissions.canUpload) {
      return sendErrorResponse(res, ERROR_CODES.DOC_UPLOAD_PERMISSION_DENIED, 403,
        "Only the assigned team member or project owner can upload documents");
    }

    if (!req.file) {
      return sendErrorResponse(res, ERROR_CODES.DOC_UPLOAD_NO_FILE, 400);
    }

    const file = req.file;
    const filePath = getFilePath(file.filename);
    
    logInfo('File upload attempt', {
      Task: taskId,
      User: userId,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    });

    // Create document record
    const documentId = await createDocument({
      filename: file.filename,
      originalFilename: file.originalname,
      filePath,
      fileSize: file.size,
      mimeType: file.mimetype,
      taskId,
      authorId: userId
    });

    logInfo('File saved to', { filePath });

    // Get the created document with author info
    const document = await getDocumentWithAuthor(documentId);

    sendSuccessResponse(res, {
      id: document.id,
      filename: document.filename,
      original_filename: document.original_filename,
      file_size: document.file_size,
      mime_type: document.mime_type,
      author_id: document.author_id,
      author_name: document.author_name,
      created_at: document.created_at
    }, 201);

  } catch (error) {
    logError('Upload failed', error, { Task: taskId, User: userId });
    sendErrorResponse(res, ERROR_CODES.DOC_UPLOAD_FAILED, 500);
  }
};

// Get all documents for a task
export const getTaskDocuments = async (req, res) => {
  const { taskId } = req;
  const userId = req.user.id;

  try {
    // Check permissions
    const permissions = await checkDocumentPermissions(taskId, userId);
    
    if (!permissions.canView) {
      return sendErrorResponse(res, ERROR_CODES.DOC_LIST_PERMISSION_DENIED, 403,
        "Only the assigned team member or project owner can view documents");
    }

    // Get documents for this task
    const documents = await fetchTaskDocuments(taskId);

    sendSuccessResponse(res, {
      documents: documents,
      task_id: taskId
    });

  } catch (error) {
    logError('Failed to retrieve documents', error, { Task: taskId, User: userId });
    sendErrorResponse(res, ERROR_CODES.DOC_LIST_FAILED, 500);
  }
};

// Download a document
export const downloadDocument = async (req, res) => {
  const { documentId } = req;
  const userId = req.user.id;

  try {
    // Get document and task info
    const document = await getDocumentById(documentId);

    if (!document) {
      return sendErrorResponse(res, ERROR_CODES.DOC_NOT_FOUND, 404);
    }

    const isAssignee = document.assignee_id === userId;
    const isProjectOwner = document.project_owner_id === userId;

    logDebug('Download permission check', {
      Document: documentId,
      User: userId,
      isAssignee,
      isProjectOwner
    });

    if (!isAssignee && !isProjectOwner) {
      return sendErrorResponse(res, ERROR_CODES.DOC_DOWNLOAD_PERMISSION_DENIED, 403,
        "Only the assigned team member or project owner can download documents");
    }

    // Check if file exists
    if (!fileExists(document.file_path)) {
      logError('File not found on disk', new Error('File missing'), { filePath: document.file_path });
      return sendErrorResponse(res, ERROR_CODES.DOC_FILE_NOT_FOUND, 404);
    }

    logInfo('File download', { Document: documentId, filename: document.original_filename });

    // Set headers and send file
    res.setHeader('Content-Type', document.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${document.original_filename}"`);
    
    const fileStream = fs.createReadStream(document.file_path);
    fileStream.pipe(res);

  } catch (error) {
    logError('Download failed', error, { Document: documentId, User: userId });
    sendErrorResponse(res, ERROR_CODES.DOC_DOWNLOAD_FAILED, 500);
  }
};

// Delete a document
export const deleteDocument = async (req, res) => {
  const { documentId } = req;
  const userId = req.user.id;

  try {
    // Get document and task info
    const document = await getDocumentById(documentId);

    if (!document) {
      return sendErrorResponse(res, ERROR_CODES.DOC_NOT_FOUND, 404);
    }

    const isAuthor = document.author_id === userId;
    const isProjectOwner = document.project_owner_id === userId;

    logDebug('Delete permission check', {
      Document: documentId,
      User: userId,
      isAuthor,
      isProjectOwner
    });

    if (!isAuthor && !isProjectOwner) {
      return sendErrorResponse(res, ERROR_CODES.DOC_DELETE_PERMISSION_DENIED, 403,
        "Only the document author or project owner can delete documents");
    }

    // Delete file from filesystem
    deleteFile(document.file_path);

    // Delete from database
    await deleteDocumentFromDatabase(documentId);

    sendSuccessResponse(res, {
      message: "Document deleted successfully",
      document_id: documentId
    });

  } catch (error) {
    logError('Delete failed', error, { Document: documentId, User: userId });
    sendErrorResponse(res, ERROR_CODES.DOC_DELETE_FAILED, 500);
  }
};
