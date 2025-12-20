import { apiClient } from "./apiClient";

const PROJECT_API_BASE_URL = "/v1/customer/projects";


export const getProjectsByCustomerApi = async (token, customerId) => {
    return await apiClient.get(`${PROJECT_API_BASE_URL}/all/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};


// Create a new project for a customer
export const createProjectApi = async (token, customerId, projectDto) => {
    return await apiClient.post(`${PROJECT_API_BASE_URL}/add/${customerId}`, projectDto, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Delete an entire project
export const deleteProjectApi = async (token, projectId) => {
    return await apiClient.delete(`${PROJECT_API_BASE_URL}/delete/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/**
 * PROJECT DETAIL (SUB-TASK) OPERATIONS
 */

// Add a sub-task to an existing project
export const addProjectDetailApi = async (token, projectId, detailDto) => {
    return await apiClient.post(`${PROJECT_API_BASE_URL}/detail/add/${projectId}`, detailDto, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Update specific fields of a sub-task (e.g., status, name, budget)
export const updateProjectDetailApi = async (token, detailId, updateDto) => {
    return await apiClient.patch(`${PROJECT_API_BASE_URL}/detail/update/${detailId}`, updateDto, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Delete a specific sub-task
export const deleteProjectDetailApi = async (token, detailId) => {
    return await apiClient.delete(`${PROJECT_API_BASE_URL}/detail/delete/${detailId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};