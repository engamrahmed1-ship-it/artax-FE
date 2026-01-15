import { apiClient } from "./apiClient";

const LEAD_API_BASE_URL = "/v1/lead";

/**
 * Get all leads
 * @param {string} token - Auth token
 * @returns {Promise} - API response with leads array
 */
export const getAllLeads = (token) => {
  console.log("token in api", token);
  return apiClient.get(`${LEAD_API_BASE_URL}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

/**
 * Get a specific lead by ID
 * @param {string} token - Auth token
 * @param {number} leadId - Lead ID
 * @returns {Promise} - API response with lead data
 */
export const getLeadById = (token, leadId) => {
  return apiClient.get(`${LEAD_API_BASE_URL}/${leadId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

/**
 * Create a new lead
 * @param {string} token - Auth token
 * @param {object} leadData - Lead data to create
 * @returns {Promise} - API response
 */
export const createLead = (token, leadData) => {
  console.log("token in api", token);
  console.log("leadData", leadData);

  return apiClient.post(
    `${LEAD_API_BASE_URL}`,
    leadData,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

/**
 * Update an existing lead
 * @param {string} token - Auth token
 * @param {number} leadId - Lead ID
 * @param {object} updateData - Updated lead data
 * @returns {Promise} - API response
 */
export const updateLead = (token, leadId, updateData) => {
  console.log("Updating lead", leadId, "with data:", updateData);
  return apiClient.put(
    `${LEAD_API_BASE_URL}/${leadId}`,
    updateData,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

/**
 * Delete a lead
 * @param {string} token - Auth token
 * @param {number} leadId - Lead ID
 * @returns {Promise} - API response
 */
export const deleteLead = (token, leadId) => {
  return apiClient.delete(
    `${LEAD_API_BASE_URL}/${leadId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

// /**
//  * Convert lead to customer
//  * @param {string} token - Auth token
//  * @param {number} leadId - Lead ID
//  * @param {object} conversionData - Conversion data (amount, opportunity, currency)
//  * @returns {Promise} - API response
//  */
// export const convertLeadToCustomer = (token, leadId, conversionData) => {
//   console.log("Converting lead", leadId, "with data:", conversionData);
  
//   return apiClient.post(
//     `${LEAD_API_BASE_URL}/${leadId}/convert`,
//     conversionData,
//     {
//       headers: { Authorization: `Bearer ${token}` }
//     }
//   );
// };

/**
 * Search leads with filters
 * @param {string} token - Auth token
 * @param {object} params - Search parameters (status, name, phone, etc.)
 * @returns {Promise} - API response with filtered leads
 */
export const searchLeads = async (token, params = {}) => {
  try {
    console.log("API Call - searchLeads", params);
    const response = await apiClient.get(`${LEAD_API_BASE_URL}/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: params,
    });
    return response;
  } catch (error) {
    throw error;
  }
};