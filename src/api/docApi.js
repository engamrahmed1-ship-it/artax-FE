import { apiClient } from "./apiClient";

const DOCUMENT_API_BASE_URL = "/v1/customer/documents";

/**
 * Upload a document
 */
export const uploadDocument = (token, customerId, file, metadata) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

  return apiClient.post(`${DOCUMENT_API_BASE_URL}/upload/${customerId}`, formData, {
    headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' 
    }
  });
};

/**
 * Download a document (returns Blob)
 */
export const downloadDocument = (token, documentId) => {
  return apiClient.get(`${DOCUMENT_API_BASE_URL}/download/${documentId}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob' // <--- THIS IS REQUIRED
  });
};

/**
 * Delete a document
 */
export const deleteDocument = (token, documentId) => {
  return apiClient.delete(`${DOCUMENT_API_BASE_URL}/delete/${documentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

/**
 * Get Preview URL (If your BIL provides a direct link or base64)
 */
// docApi.js - Line update
export const getDocumentPreview = (token, documentId) => {
    return apiClient.get(`${DOCUMENT_API_BASE_URL}/preview/${documentId}`, {
      headers: { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` }
    });
};
