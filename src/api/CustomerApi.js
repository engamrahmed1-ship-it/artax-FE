import { apiClient } from "./apiClient";

const CUSTOMER_API_BASE_URL = "/v1/customer";

export const getCustomerProfile = (customerId, token) => {
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
