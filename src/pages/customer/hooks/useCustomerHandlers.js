import { addContact, deleteContact, setPrimaryContact,
     updateCustomer, createActivity, 
     deleteActivity, getActivities ,
    getNotes, 
    createNoteApi, 
    updateNoteApi, 
    deleteNoteApi} from '../../../api/CustomerApi';
import {
    createProjectApi,
    deleteProjectApi,
    addProjectDetailApi,
    deleteProjectDetailApi,
    updateProjectDetailApi
} from '../../../api/ProjectApi';
import { opportunitiesApi } from '../../../api/OpportunitiesApi';

import {
    createTicketApi,
    deleteTicketApi,
    getTicketsByCustomerApi,
    updateTicketApi
} from '../../../api/ticketsApi'; // Ensure the path matches your file structure
import { useCallback } from 'react';
import { deleteDocument, downloadDocument, uploadDocument } from '../../../api/docApi';

export const useCustomerHandlers = ({
    token,
    customerData,
    setCustomerData,
    setIsEditing,
    isEditing,
    setActiveTab,
    setLoading,
    projects,
    setProjects,
    setSelectedProject,
    selectedProject,
    setShowProjectModal,
    setShowAddModal,
    refreshCustomerData,
    loadCustomerProjects,
    mapCustomerToDisplay,
    updateTabCustomer,
    setNotes,
    setActivities,        // Add this
    setActivitiesPages,   // Add this
    setActivitiesCurrentPage, // Add this
}) => {

    // --- Navigation ---
    const handleSubTabChange = (newTab) => {
        if (isEditing) {
            const confirmLeave = window.confirm("You have unsaved changes. Discard them?");
            if (!confirmLeave) return;
        }
        setIsEditing(false);
        setActiveTab(newTab);
    };

    const handleCancel = () => {
        setIsEditing(false);
        refreshCustomerData();
    };

    // --- Overview / Edit ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setCustomerData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setCustomerData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const isB2C = customerData.custType === 'B2C';
            const updatePayload = {
                status: customerData.status,
                b2c: isB2C ? {
                    ...customerData.b2c,
                    firstName: customerData.firstName,
                    lastName: customerData.lastName,
                    email: customerData.email,
                    phone: customerData.phone,
                    addresses: [{
                        street: customerData.street, city: customerData.city, state: customerData.state,
                        zipCode: customerData.zipCode, country: customerData.country
                    }]
                } : null,
                b2b: !isB2C ? {
                    companyName: customerData.company,
                    street: customerData.street,
                    city: customerData.city,
                    state: customerData.state,
                    zipCode: customerData.zipCode ? Number(customerData.zipCode) : null,
                    country: customerData.country,
                    // FIX: Pull from customerData.b2b because that's where mapCustomerToUI put them
                    commercialRegister: customerData.b2b?.commercialRegister,
                    website: customerData.b2b?.website,
                    companyClass: customerData.b2b?.companyClass,
                    industry: customerData.b2b?.industry,
                    companySize: customerData.b2b?.companySize,
                    primaryContactId: customerData.b2b?.primaryContactId ? Number(customerData.b2b.primaryContactId) : null
                } : null
            };

            console.log('Update Payload:', updatePayload);

            const response = await updateCustomer(token, customerData.customerId, updatePayload);
            if (response.data) {
                mapCustomerToDisplay(response.data);
                updateTabCustomer(customerData.customerId, response.data);
                setIsEditing(false);
                alert('Customer information saved successfully!');
            }
        } catch (error) {
            console.error('Error saving customer:', error);
            alert('Failed to save customer data.');
        } finally {
            setLoading(false);
        }
    };

    // --- Contacts ---
    const handleAddContact = async (formData) => {
        try {
            setLoading(true);
            await addContact(token, customerData.customerId, formData);
            setShowAddModal(false);
            alert('Contact added successfully!');
            await refreshCustomerData();
        } catch (error) {
            console.error('Error adding contact', error);
            alert('Failed to add contact.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteContact = async (contactId) => {
        if (contactId === customerData.b2b?.primaryContactId) {
            alert("Cannot delete the primary contact. Please set another contact as primary first.");
            return;
        }
        if (!window.confirm('Are you sure you want to delete this contact?')) return;
        try {
            setLoading(true);
            await deleteContact(token, customerData.customerId, contactId);
            alert('Contact deleted successfully!');
            refreshCustomerData();
        } catch (error) {
            console.error('Error deleting contact', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetPrimaryContact = async (contactId) => {
        try {
            const response = await setPrimaryContact(token, customerData.customerId, contactId);
            if (response.data && response.data.customerId) {
                mapCustomerToDisplay(response.data);
                updateTabCustomer(response.data.customerId, response.data);
            } else {
                setTimeout(() => refreshCustomerData(), 300);
            }
        } catch (error) {
            console.error('Error setting primary contact', error);
        }
    };

    // --- Projects ---
    const handleCreateProject = async (projectDto) => {
        try {
            setLoading(true);
            await createProjectApi(token, customerData.customerId, projectDto);
            setShowProjectModal(false);
            alert('Project created successfully!');
            await loadCustomerProjects();
        } catch (error) {
            console.error('Error creating project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm("Are you sure? This will delete all sub-tasks permanently.")) return;
        try {
            setLoading(true);
            await deleteProjectApi(token, projectId);
            await loadCustomerProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNewTask = (projectId) => {
        const newTaskTemplate = {
            projectSubId: `temp-${Date.now()}`,
            subName: '',
            priority: 2,
            budget: 0,
            status: 'OPEN',
            isNew: true
        };

        setProjects(prev => prev.map(proj =>
            proj.projectId === projectId
                ? { ...proj, details: [newTaskTemplate, ...(proj.details || [])] }
                : proj
        ));

        const target = projects.find(p => p.projectId === projectId);
        if (target) {
            setSelectedProject({ ...target, details: [newTaskTemplate, ...(target.details || [])] });
        }
        setShowProjectModal(true);
    };

    const handleSaveTask = async (projectId, detailObj) => {
        try {
            setLoading(true);
            const priorityMap = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
            let finalPriority = typeof detailObj.priority === 'string'
                ? priorityMap[detailObj.priority.toUpperCase()] || 2
                : detailObj.priority || 2;

            const detailDto = {
                subName: detailObj.subName || "New Task",
                status: detailObj.status || "OPEN",
                priority: finalPriority,
                budget: parseFloat(detailObj.budget) || 0
            };

            await addProjectDetailApi(token, projectId, detailDto);
            setShowProjectModal(false);
            await loadCustomerProjects();
        } catch (error) {
            console.error("Error saving detail:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (detailId) => {
        if (String(detailId).startsWith('temp-')) {
            setProjects(prev => prev.map(proj => ({ ...proj, details: proj.details.filter(d => d.projectSubId !== detailId) })));
            setSelectedProject(prev => ({ ...prev, details: prev.details.filter(d => d.projectSubId !== detailId) }));
            return;
        }

        if (!window.confirm("Are you sure you want to delete this sub-task?")) return;
        try {
            setLoading(true);
            await deleteProjectDetailApi(token, detailId);
            await loadCustomerProjects();
            if (selectedProject) {
                setSelectedProject(prev => ({ ...prev, details: prev.details.filter(d => d.projectSubId !== detailId) }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDetail = async (subId, updatedFields) => {
        try {
            await updateProjectDetailApi(token, subId, updatedFields);
            setProjects(prev => prev.map(proj => {
                if (proj.details?.some(d => d.projectSubId === subId)) {
                    const updatedDetails = proj.details.map(d => d.projectSubId === subId ? { ...d, ...updatedFields } : d);
                    const allDone = updatedDetails.every(d => d.status === 'COMPLETED');
                    const anyStarted = updatedDetails.some(d => d.status === 'IN_PROGRESS' || d.status === 'COMPLETED');
                    const newStatus = allDone ? 'CLOSED' : (anyStarted ? 'IN_PROGRESS' : 'OPEN');
                    const updatedProj = { ...proj, details: updatedDetails, status: newStatus };
                    setSelectedProject(updatedProj);
                    return updatedProj;
                }
                return proj;
            }));
        } catch (error) {
            console.error(error);
        }
    };

    // --- Opportunities ---
    const handleSaveOpportunity = async (formData, opportunityId) => {
        try {
            setLoading(true);
            if (opportunityId) {
                await opportunitiesApi.update(token, opportunityId, formData);
                alert('Opportunity updated successfully');
            } else {
                await opportunitiesApi.add(token, customerData.customerId, formData);
                alert('Opportunity created successfully');
            }
            await refreshCustomerData();
        } catch (error) {
            console.error('Error saving opportunity:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOpportunity = async (opportunityId) => {
        try {
            setLoading(true);
            await opportunitiesApi.delete(token, opportunityId);
            alert('Opportunity deleted');
            await refreshCustomerData();
        } catch (error) {
            console.error('Error deleting opportunity:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Tickets ---
    const handleSaveTicket = async (formData, ticketId) => {
        try {
            setLoading(true);
            // Construct the DTO (including status and resolution for updates)
            const ticketDto = {
                subject: formData.subject,
                description: formData.description,
                priority: formData.priority,
                status: formData.status, // Added for update
                assignedTo: formData.assignedTo,
                resolution: formData.resolution // Added for update
            };
            if (ticketId) {
                // If you implement an update API later, it goes here
                console.log("Updating ticket:", ticketId);
                await updateTicketApi(token, ticketId, ticketDto);
                alert('Ticket updated successfully!');
            } else {
                console.log("Creating new ticket for customer:", customerData.customerId);

                await createTicketApi(token, customerData.customerId, ticketDto);
                alert('Ticket created successfully!');
            }
            // refreshCustomerData should trigger the re-fetch of the tickets list
            await refreshCustomerData();
        } catch (error) {
            console.error("Error saving ticket:", error);
            alert('Failed to save ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTicket = async (ticketId) => {
        // Since ticketId in your table might be the 'ticketCode' (e.g., TKT-123),
        // ensure you are passing the numeric Database ID if that's what the API expects.
        if (!window.confirm("Are you sure you want to delete this ticket?")) return;

        try {
            setLoading(true);
            await deleteTicketApi(token, ticketId);
            alert('Ticket deleted successfully');
            await refreshCustomerData();
        } catch (error) {
            console.error("Error deleting ticket:", error);
            alert('Failed to delete ticket.');
        } finally {
            setLoading(false);
        }
    };

    // --- Activities ---
    // Inside useCustomerHandlers.js

    // --- Activities (Interactions) ---
    const handleAddActivity = async (activityData) => {
        try {
            setLoading(true);
            // activityData comes from ActivityModal with type, subject, description, etc.
            const response = await createActivity(token, customerData.customerId, activityData);

            if (response.status === 200 || response.status === 201) {
                alert('Activity logged successfully!');
                // Refresh customer data to see the new interaction in the timeline
                await loadCustomerActivities(0);
            }
        } catch (error) {
            console.error('Error adding activity:', error);
            alert('Failed to log activity. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Also add a delete handler if you want to support it in the UI
    const handleDeleteActivity = async (interactionId) => {
        if (!window.confirm("Delete this activity log?")) return;
        try {
            setLoading(true);
            await deleteActivity(token, interactionId);
            await loadCustomerActivities(0);
        } catch (error) {
            console.error('Error deleting activity:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCustomerActivities = useCallback(async (page = 0) => {
        if (!customerData.customerId || !token) return;
        try {
            setLoading(true);
            const response = await getActivities(token, customerData.customerId, page, 10);

            if (response.data) {
                setActivities(response.data.content || []);
                setActivitiesPages(response.data.totalPages || 1);
                setActivitiesCurrentPage(page);
            }
        } catch (error) {
            console.error("Error loading paginated activities:", error);
        } finally {
            setLoading(false);
        }
    }, [customerData.customerId, token, setLoading, setActivities, setActivitiesPages, setActivitiesCurrentPage]);


    // --- Documents ---

    const handleUploadDocument = async (file, docType, projectId) => {
        try {

            console.log("Uploading document:", docType, projectId);
            setLoading(true);
            // Map frontend values to match the backend DocumentCreateRequest DTO keys
            const metadata = {
                customerId: customerData.customerId, // Added to match DTO
                projectId: projectId ? Number(projectId) : null, // Ensure ID is a number
                documentType: docType || 'OTHER' // Use 'documentType' to match DTO field
            };

            // Pass metadata to your API utility
            await uploadDocument(token, customerData.customerId, file, metadata);
            alert('Document uploaded successfully');
            await refreshCustomerData(); // Refresh to show new doc in list
        } catch (error) {
            console.error("Upload failed", error);
            alert(error.response?.data?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadDocument = async (docId, fileName) => {
        try {
            setLoading(true);
            // 1. Call the API (Ensure your API utility uses responseType: 'blob')
            const response = await downloadDocument(token, docId);

            // 2. Create a Blob from the response data
            const blob = new Blob([response.data], {
                type: response.headers['content-type']
            });

            // 3. Create a temporary URL for the Blob
            const downloadUrl = window.URL.createObjectURL(blob);

            // 4. Create a hidden anchor element to trigger the download
            const link = document.createElement('a');
            link.href = downloadUrl;

            // Use the fileName passed from the UI, or fallback to a default
            link.download = fileName || `document_${docId}`;

            document.body.appendChild(link);
            link.click();

            // 5. Cleanup: remove element and revoke the object URL to save memory
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

        } catch (error) {
            console.error("Download failed", error);
            alert("Failed to download document. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDocument = async (docId) => {
        if (!window.confirm("Delete this document permanently?")) return;
        try {
            setLoading(true);
            await deleteDocument(token, docId);
            await refreshCustomerData();
        } catch (error) {
            console.error("Delete failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDocumentProject = async (docId, projectId) => {
        try {
            setLoading(true);
            // You'll need to create this function in docApi.js
            // e.g., export const updateDocument = (token, id, data) => apiClient.patch(...)
            // await updateDocumentProject(token, docId, { projectId: Number(projectId) });

            alert('Document moved successfully');
            await refreshCustomerData();
        } catch (error) {
            console.error("Update failed", error);
            alert("Could not move document");
        } finally {
            setLoading(false);
        }
    };

    // Inside useCustomerHandlers.js
const loadCustomerNotes = useCallback(async (page = 0) => {
        if (!customerData.customerId || !token) return;
        try {
            setLoading(true);
            const response = await getNotes(token, customerData.customerId, page, 20);
            if (response.data) {
                // Note: Ensure your backend NoteDto field names match your UI (e.g., content, author, tags)
                setNotes(response.data.content || []);
            }
        } catch (error) {
            console.error("Error loading notes:", error);
        } finally {
            setLoading(false);
        }
    }, [customerData.customerId, token, setNotes, setLoading]);

    const handleAddNote = async (newNoteData) => {
        try {
            setLoading(true);
            // Payload should match NoteCreateRequest: { content, author, tags }
            await createNoteApi(token, customerData.customerId, newNoteData);
            alert('Note added successfully');
            await loadCustomerNotes(); // Refresh list
        } catch (error) {
            console.error("Error adding note:", error);
            alert('Failed to add note');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateNote = async (noteId, updatedData) => {
        try {
            setLoading(true);
            await updateNoteApi(token, noteId, updatedData);
            alert('Note updated successfully');
            await loadCustomerNotes();
        } catch (error) {
            console.error("Error updating note:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            setLoading(true);
            await deleteNoteApi(token, noteId);
            await loadCustomerNotes();
        } catch (error) {
            console.error("Error deleting note:", error);
            alert('Failed to delete note');
        } finally {
            setLoading(false);
        }
    };


    return {
        handleSubTabChange, handleCancel, handleInputChange, handleSave,
        handleAddContact, handleDeleteContact, handleSetPrimaryContact,
        handleCreateProject, handleDeleteProject, handleAddNewTask,
        handleSaveTask, handleDeleteTask, handleUpdateDetail,
        handleSaveOpportunity, handleDeleteOpportunity,
        handleSaveTicket,
        handleDeleteTicket,
        handleAddActivity,
        handleDeleteActivity, loadCustomerActivities,
        handleUploadDocument,
        handleDownloadDocument,
        handleDeleteDocument,
        handleAddNote,
        handleDeleteNote,
        handleUpdateNote,
        loadCustomerNotes
    };
};