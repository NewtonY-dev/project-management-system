import db from "../config/db.js";
import { logInfo, logError, logDebug } from "../utils/logger.js";
import { ERROR_CODES, ERROR_MESSAGES } from "../constants/fileTypes.js";

// Check document permissions
export const checkDocumentPermissions = async (taskId, userId) => {
  try {
    const [tasks] = await db.query(
      `SELECT t.assignee_id, p.owner_id as project_owner_id
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       WHERE t.id = ?`,
      [taskId]
    );

    if (tasks.length === 0) {
      return { canView: false, canUpload: false, canDelete: false, error: "Task not found" };
    }

    const task = tasks[0];
    const isAssignee = task.assignee_id === userId;
    const isProjectOwner = task.project_owner_id === userId;

    logDebug('Permission check', {
      Task: taskId,
      User: userId,
      isAssignee,
      isProjectOwner
    });

    return {
      canView: isAssignee || isProjectOwner,
      canUpload: isAssignee || isProjectOwner,
      canDelete: isProjectOwner,
      task,
      isAssignee,
      isProjectOwner
    };
  } catch (error) {
    logError('Permission check failed', error, { Task: taskId, User: userId });
    return { canView: false, canUpload: false, canDelete: false, error: "Permission check failed" };
  }
};

// Create document record
export const createDocument = async (documentData) => {
  try {
    const [result] = await db.query(
      `INSERT INTO documents (filename, original_filename, file_path, file_size, mime_type, task_id, author_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        documentData.filename,
        documentData.originalFilename,
        documentData.filePath,
        documentData.fileSize,
        documentData.mimeType,
        documentData.taskId,
        documentData.authorId
      ]
    );

    logInfo('Document created with ID', { documentId: result.insertId });
    return result.insertId;
  } catch (error) {
    logError('Failed to create document record', error);
    throw error;
  }
};

// Get document by ID with full details
export const getDocumentById = async (documentId) => {
  try {
    const [documents] = await db.query(
      `SELECT d.*, t.id as task_id, t.assignee_id, p.owner_id as project_owner_id
       FROM documents d
       JOIN tasks t ON d.task_id = t.id
       JOIN projects p ON t.project_id = p.id
       WHERE d.id = ?`,
      [documentId]
    );

    return documents.length > 0 ? documents[0] : null;
  } catch (error) {
    logError('Failed to get document by ID', error, { documentId });
    throw error;
  }
};

// Get documents for task with author info
export const fetchTaskDocuments = async (taskId) => {
  try {
    const [documents] = await db.query(
      `SELECT d.*, u.name as author_name
       FROM documents d
       JOIN users u ON d.author_id = u.id
       WHERE d.task_id = ?
       ORDER BY d.created_at DESC`,
      [taskId]
    );

    logInfo('Documents retrieved', { Task: taskId, count: documents.length });
    return documents;
  } catch (error) {
    logError('Failed to retrieve task documents', error, { Task: taskId });
    throw error;
  }
};

// Get document with author info
export const getDocumentWithAuthor = async (documentId) => {
  try {
    const [documents] = await db.query(
      `SELECT d.*, u.name as author_name
       FROM documents d
       JOIN users u ON d.author_id = u.id
       WHERE d.id = ?`,
      [documentId]
    );

    return documents.length > 0 ? documents[0] : null;
  } catch (error) {
    logError('Failed to get document with author', error, { documentId });
    throw error;
  }
};

// Delete document from database
export const deleteDocumentFromDatabase = async (documentId) => {
  try {
    await db.query("DELETE FROM documents WHERE id = ?", [documentId]);
    logInfo('Document deleted from database', { Document: documentId });
  } catch (error) {
    logError('Failed to delete document from database', error, { documentId });
    throw error;
  }
};

// Validate task exists
export const validateTaskExists = async (taskId) => {
  try {
    const [tasks] = await db.query("SELECT id FROM tasks WHERE id = ?", [taskId]);
    return tasks.length > 0;
  } catch (error) {
    logError('Failed to validate task exists', error, { taskId });
    throw error;
  }
};
