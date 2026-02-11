import { ERROR_CODES, ERROR_MESSAGES } from "../constants/fileTypes.js";

// Validate task ID parameter
export const validateTaskId = (req, res, next) => {
  const taskId = parseInt(req.params.taskId);
  
  if (isNaN(taskId) || taskId <= 0) {
    return res.status(400).json({
      error: ERROR_MESSAGES[ERROR_CODES.DOC_UPLOAD_INVALID_TASK_ID],
      code: ERROR_CODES.DOC_UPLOAD_INVALID_TASK_ID
    });
  }
  
  req.taskId = taskId;
  next();
};

// Validate document ID parameter
export const validateDocumentId = (req, res, next) => {
  const documentId = parseInt(req.params.documentId);
  
  if (isNaN(documentId) || documentId <= 0) {
    return res.status(400).json({
      error: ERROR_MESSAGES[ERROR_CODES.DOC_DOWNLOAD_INVALID_ID],
      code: ERROR_CODES.DOC_DOWNLOAD_INVALID_ID
    });
  }
  
  req.documentId = documentId;
  next();
};

// Standardized error response
export const sendErrorResponse = (res, errorCode, statusCode = 500, details = null) => {
  const response = {
    error: ERROR_MESSAGES[errorCode],
    code: errorCode
  };
  
  if (details) {
    response.details = details;
  }
  
  return res.status(statusCode).json(response);
};

// Standardized success response
export const sendSuccessResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json(data);
};
