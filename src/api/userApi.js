import { apiClient } from "./apiClient";

// Matches your Gateway Route: /v1/integration/**
const SUPPORT_API_BASE_URL = "/v1/integration/support";

/**
 * Fetches all users belonging to the SUPPORT group from Keycloak via BIL
 */
export const getSupportTeamApi = async (token) => {
    try {
        const response = await apiClient.get(`${SUPPORT_API_BASE_URL}/team`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // Returning data directly for easier use in components
    } catch (error) {
        console.error("Error in getSupportTeamApi:", error);
        throw error;
    }
};