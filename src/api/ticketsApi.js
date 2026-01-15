import { apiClient } from "./apiClient";

const TICKET_API_BASE_URL = "/v1/customer/tickets";

/**
 * TICKET OPERATIONS
 */

// Get all tickets for a specific customer with pagination
export const getTicketsByCustomerApi = async (token, customerId, page = 0, size = 20) => {
    return await apiClient.get(`${TICKET_API_BASE_URL}/all/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size }
    });
};

// Create a new support ticket for a customer
export const createTicketApi = async (token, customerId, ticketDto) => {
    return await apiClient.post(`${TICKET_API_BASE_URL}/add/${customerId}`, ticketDto, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Delete a specific ticket
export const deleteTicketApi = async (token, ticketId) => {
    return await apiClient.delete(`${TICKET_API_BASE_URL}/delete/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};


export const updateTicketApi = (token, ticketId, ticketRequest) => {
    return apiClient.put(`${TICKET_API_BASE_URL}/update/${ticketId}`, ticketRequest, {
        headers: { Authorization: `Bearer ${token}` }
    });
};