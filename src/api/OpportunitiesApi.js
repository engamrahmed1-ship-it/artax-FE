import { apiClient } from "./apiClient";

const BASE_URL = '/v1/customer/opportunities';

export const opportunitiesApi = {
    // Get all opportunities for a customer
    getByCustomer: async (token, customerId, page = 0, size = 20) => {
        return await apiClient.get(`${BASE_URL}/all/${customerId}`, {
            params: { page, size },
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Get a specific opportunity
    getById: async (token, id) => {
        return await apiClient.get(`${BASE_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Add a new opportunity
    add: async (token, customerId, data) => {
        return await apiClient.post(`${BASE_URL}/add/${customerId}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Update an existing opportunity
    update: async (token, opportunityId, data) => {
        return await apiClient.put(`${BASE_URL}/update/${opportunityId}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Delete an opportunity
    delete: async (token, id) => {
        return await apiClient.delete(`${BASE_URL}/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};