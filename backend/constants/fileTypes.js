// File type constants and validation
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png", 
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain"
];

export const ALLOWED_FILE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt'];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ERROR_CODES = {
  // Upload errors
  DOC_UPLOAD_INVALID_TASK_ID: 'DOC_UPLOAD_INVALID_TASK_ID',
  DOC_UPLOAD_PERMISSION_DENIED: 'DOC_UPLOAD_PERMISSION_DENIED',
  DOC_UPLOAD_NO_FILE: 'DOC_UPLOAD_NO_FILE',
  DOC_UPLOAD_SIZE_EXCEEDED: 'DOC_UPLOAD_SIZE_EXCEEDED',
  DOC_UPLOAD_INVALID_TYPE: 'DOC_UPLOAD_INVALID_TYPE',
  DOC_UPLOAD_TOO_MANY_FILES: 'DOC_UPLOAD_TOO_MANY_FILES',
  DOC_UPLOAD_FAILED: 'DOC_UPLOAD_FAILED',
  
  // List errors
  DOC_LIST_INVALID_TASK_ID: 'DOC_LIST_INVALID_TASK_ID',
  DOC_LIST_PERMISSION_DENIED: 'DOC_LIST_PERMISSION_DENIED',
  DOC_LIST_FAILED: 'DOC_LIST_FAILED',
  
  // Download errors
  DOC_DOWNLOAD_INVALID_ID: 'DOC_DOWNLOAD_INVALID_ID',
  DOC_DOWNLOAD_PERMISSION_DENIED: 'DOC_DOWNLOAD_PERMISSION_DENIED',
  DOC_FILE_NOT_FOUND: 'DOC_FILE_NOT_FOUND',
  DOC_DOWNLOAD_FAILED: 'DOC_DOWNLOAD_FAILED',
  
  // Delete errors
  DOC_DELETE_INVALID_ID: 'DOC_DELETE_INVALID_ID',
  DOC_DELETE_PERMISSION_DENIED: 'DOC_DELETE_PERMISSION_DENIED',
  DOC_DELETE_FAILED: 'DOC_DELETE_FAILED',
  
  // General errors
  DOC_NOT_FOUND: 'DOC_NOT_FOUND'
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.DOC_UPLOAD_INVALID_TASK_ID]: 'Invalid task ID',
  [ERROR_CODES.DOC_UPLOAD_PERMISSION_DENIED]: 'You cannot upload documents to this task',
  [ERROR_CODES.DOC_UPLOAD_NO_FILE]: 'No file uploaded',
  [ERROR_CODES.DOC_UPLOAD_SIZE_EXCEEDED]: 'File size exceeds 10MB limit',
  [ERROR_CODES.DOC_UPLOAD_INVALID_TYPE]: 'File type not allowed. Allowed types: jpg, png, gif, pdf, doc, docx, txt',
  [ERROR_CODES.DOC_UPLOAD_TOO_MANY_FILES]: 'Too many files uploaded',
  [ERROR_CODES.DOC_UPLOAD_FAILED]: 'Failed to upload document',
  
  [ERROR_CODES.DOC_LIST_INVALID_TASK_ID]: 'Invalid task ID',
  [ERROR_CODES.DOC_LIST_PERMISSION_DENIED]: 'You cannot view documents for this task',
  [ERROR_CODES.DOC_LIST_FAILED]: 'Failed to retrieve documents',
  
  [ERROR_CODES.DOC_DOWNLOAD_INVALID_ID]: 'Invalid document ID',
  [ERROR_CODES.DOC_DOWNLOAD_PERMISSION_DENIED]: 'You cannot download this document',
  [ERROR_CODES.DOC_FILE_NOT_FOUND]: 'File not found on server',
  [ERROR_CODES.DOC_DOWNLOAD_FAILED]: 'Failed to download document',
  
  [ERROR_CODES.DOC_DELETE_INVALID_ID]: 'Invalid document ID',
  [ERROR_CODES.DOC_DELETE_PERMISSION_DENIED]: 'You cannot delete this document',
  [ERROR_CODES.DOC_DELETE_FAILED]: 'Failed to delete document',
  
  [ERROR_CODES.DOC_NOT_FOUND]: 'Document not found'
};
