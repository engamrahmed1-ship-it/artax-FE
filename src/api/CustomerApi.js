import { apiClient } from "./apiClient";

const CUSTOMER_API_BASE_URL = "/v1/customer";

export const getCustomerProfile = ( token,customerId) => {
  return apiClient.get(`${CUSTOMER_API_BASE_URL}/profile/${customerId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export const getAllCustomer = ( token) => {
    console.log("token in api", token);
  return apiClient.get(`${CUSTOMER_API_BASE_URL}/search`,  {
    headers: { Authorization: `Bearer ${token}` }
  });
}


export const createCustomer = (token, customerData) => {
    console.log("token in api", token);
    console.log("customerData", customerData);

    return apiClient.post(
        `${CUSTOMER_API_BASE_URL}`,
        customerData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};


// CustomerApi.js

export const updateCustomer = (token, customerId, updateData) => {
    return apiClient.put(
        `${CUSTOMER_API_BASE_URL}/${customerId}`,
        updateData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

// export const getAllCustomerWithType = (token, type,param,value, page = 0) =>
//   console.log("API Call - getAllCustomerWithType", { token, type, param, value, page }) ||
//   apiClient.get(`${CUSTOMER_API_BASE_URL}/search`, {
//     headers: { Authorization: `Bearer ${token}` },
//     params: {
//       page: page,
//       // Added 'type' as 'custType' to the query parameters
//       custType: type ,
//       [param]: value
//     }
//   });


// services/customerApi.ts or similar
// services/customerApi.js  (or wherever you keep your API calls)

// In your API file
export const getCustomers = async (token, params = {}) => {
  try {
    console.log("API Call - getCustomers",  params );  
    // Added 'await' here
    const response = await apiClient.get(`${CUSTOMER_API_BASE_URL}/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: params,
    });
    return response;
  } catch (error) {
    throw error;
  }
};



// Line ~55: Add after createCustomer / getCustomers

/**
 * Add a new contact to a customer
 * @param {string} token - Auth token
 * @param {number} customerId - Customer ID
 * @param {object} contactData - Contact payload
 */
export const addContact = (token, customerId, contactData) => {
  return apiClient.post(
    `${CUSTOMER_API_BASE_URL}/contact/add/${customerId}`,
    contactData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

/**
 * Delete a contact from a customer
 * @param {string} token - Auth token
 * @param {number} customerId - Customer ID
 * @param {number} contactId - Contact ID to delete
 */
export const deleteContact = (token, customerId, contactId) => {
  return apiClient.delete(
    `${CUSTOMER_API_BASE_URL}/contact/delete/${customerId}/${contactId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

/**
 * Set a contact as the primary contact
 * @param {string} token - Auth token
 * @param {number} customerId - Customer ID
 * @param {number} contactId - Contact ID to set as primary
 */
export const setPrimaryContact = (token, customerId, contactId) => {
  return apiClient.put(
    `${CUSTOMER_API_BASE_URL}/contact/primary/${customerId}/${contactId}`,
    null,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
// ===============================
// Interaction (Activity) API Endpoints
// ===============================

// Update this to match your BIL port and path
const INTERACTION_API_BASE_URL = '/v1/customer/interactions';

/**
 * Create a new interaction for a customer
 * @param {string} token - Auth token
 * @param {number} customerId - Customer ID
 * @param {object} activityData - Activity payload (InteractionCreateRequest)
 */
export const createActivity = (token, customerId, activityData) => {
  return apiClient.post(
    `${INTERACTION_API_BASE_URL}/add/${customerId}`,
    activityData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

/**
 * Get all interactions for a customer (Paginated)
 * @param {string} token - Auth token
 * @param {number} customerId - Customer ID
 * @param {number} page - Page number (default 0)
 * @param {number} size - Page size (default 20)
 */
export const getActivities = (token, customerId, page = 0, size = 20) => {
  return apiClient.get(
    `${INTERACTION_API_BASE_URL}/all/${customerId}`,
    { 
      params: { page, size },
      headers: { Authorization: `Bearer ${token}` } 
    }
  );
};

/**
 * Delete an interaction
 * @param {string} token - Auth token
 * @param {number} interactionId - ID of the interaction to delete
 */
export const deleteActivity = (token, interactionId) => {
  return apiClient.delete(
    `${INTERACTION_API_BASE_URL}/delete/${interactionId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};


// ... existing constants
const NOTE_API_BASE_URL = '/v1/customer/notes';

/**
 * Get all notes for a customer
 */
export const getNotes = (token, customerId, page = 0, size = 10) => {
  return apiClient.get(`${NOTE_API_BASE_URL}/all/${customerId}`, {
    params: { page, size },
    headers: { Authorization: `Bearer ${token}` }
  });
};

/**
 * Create a new note
 */
export const createNoteApi = (token, customerId, noteData) => {
const payload = {
    content: noteData.content,
    author: noteData.author,
    // Convert Array ["Tag1", "Tag2"] to String "Tag1,Tag2"
    tags: Array.isArray(noteData.tags) ? noteData.tags.join(',') : noteData.tags
  };

  console.log("Sending Payload to BIL:", payload);

  return apiClient.post(`${NOTE_API_BASE_URL}/add/${customerId}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

/**
 * Update a note (PUT)
 */
export const updateNoteApi = (token, noteId, noteData) => {
  return apiClient.put(`${NOTE_API_BASE_URL}/update/${noteId}`, noteData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

/**
 * Delete a note
 */
export const deleteNoteApi = (token, noteId) => {
  return apiClient.delete(`${NOTE_API_BASE_URL}/delete/${noteId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};