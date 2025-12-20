import React, { useCallback, useEffect, useState } from 'react';
import './css/customerInfo.css'; // Assuming this path is correct
import { useParams } from 'react-router-dom';
import { useTabContext } from '../../context/TabContext'; // Adjust path as needed
import { addContact, deleteContact, getCustomerProfile, getCustomers, setPrimaryContact } from '../../api/CustomerApi';
import { useAuth } from '../../hooks/useAuth';
import { getProjectsByCustomerApi, createProjectApi, addProjectDetailApi, updateProjectDetailApi, deleteProjectDetailApi, deleteProjectApi } from '../../api/ProjectApi';

// Import Separated Components
import CustomerHeader from './CustomerHeader';
import QuickActions from './tabs/QuickActions';
import CustomerTabs from './tabs/CustomerTabs';
import OverviewTab from './tabs/OverviewTab';
import ActivityTab from './tabs/ActivityTab';
import PurchasesTab from './tabs/PurchasesTab';
import NotesTab from './tabs/NotesTab';
import DocumentsTab from './tabs/DocumentsTab';
import ProjectsTab from './tabs/ProjectsTab';
import ContactsTab from './tabs/ContactsTab';
import ProjectModal from './model/ProjectModel';
import AddContactModal from './model/AddContactModel';
import LoadingModal from '../../components/layouts/LoadingModel';
import Tickets from './tabs/Tickets';
import Opportunities from './tabs/Opportunities';

// Import Modals (assuming they are external and not part of the main refactor)



const CustomerInfo = () => {

  const { id } = useParams();
  const { token } = useAuth();
  const {
    getActiveTab,
    tabs,
    openTab,
    updateTabCustomer
  } = useTabContext();

  // --- State Management ---
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false); // For AddContactModal
  const [showProjectModal, setShowProjectModal] = useState(false); // For ProjectModal
  const [selectedProject, setSelectedProject] = useState(null); // For ProjectModal (Edit/View)

  // Mock/Initial Data (These should ideally be fetched or managed globally)
  const [projects, setProjects] = useState([]);
  const [projectsPages, setProjectsPages] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [notes, setNotes] = useState([
    { id: 1, date: '2024-11-20', author: 'Sarah Johnson', content: 'Follow-up call scheduled for next week regarding new product demo.' },
    { id: 2, date: '2024-11-15', author: 'Mike Smith', content: 'Customer expressed interest in enterprise plan upgrade.' },
  ]);
  const [activities, setActivities] = useState([
    { id: 1, type: 'call', date: '2024-11-20 14:30', description: 'Phone call - Discussed Q4 requirements' },
    { id: 2, type: 'email', date: '2024-11-18 09:15', description: 'Email sent - Product update newsletter' },
    { id: 3, type: 'meeting', date: '2024-11-10 11:00', description: 'In-person meeting - Contract renewal discussion' },
  ]);
  const [purchases, setPurchases] = useState([
    { id: 1, date: '2024-10-15', product: 'Enterprise License', amount: '$12,000', status: 'Completed' },
    { id: 2, date: '2024-08-22', product: 'Premium Support Package', amount: '$5,000', status: 'Completed' },
    { id: 3, date: '2024-06-10', product: 'Training Services', amount: '$3,500', status: 'Completed' },
  ]);
  const [customerData, setCustomerData] = useState({
    customerId: null, custType: null, firstName: '', lastName: '', email: '', phone: '',
    company: '', position: '', status: 'Active', street: '', city: '', state: '',
    zipCode: '', country: '', dateJoined: '—', lastContact: '—', totalPurchases: '—',
    lifetimeValue: '—', b2b: null,
  });

  const [opportunities, setOpportunities] = useState([]);
  const [opportunitiesCount, setOpportunitiesCount] = useState(0);

  const [tickets, setTickets] = useState([]);
  const [ticketsCount, setTicketsCount] = useState(0);


  /* -------------------------------------------------------
     CUSTOMER → UI MAPPER
  ------------------------------------------------------- */
  /* -------------------------------------------------------
    CUSTOMER → UI MAPPER (Updated for Full Profile)
------------------------------------------------------- */
  const mapCustomerToDisplay = useCallback((cust) => {
    if (!cust) return;

    // 1. Map Interaction History to Activities
    if (cust.interactions && Array.isArray(cust.interactions)) {
      const mappedActivities = cust.interactions.map(item => ({
        id: item.interactionId,
        type: item.interactionType?.toLowerCase() || 'call',
        date: item.interactionDate,
        description: `${item.interactionType} via ${item.channel}: ${item.notes}`,
        agentId: item.agentId
      }));
      setActivities(mappedActivities);
    } else {
      console.warn("Expected interactions to be an array, but got:", cust.interactions);
      setActivities([]); // Set to empty array to avoid crashes
    }

    // --- NEW: Map Projects ---
    if (cust.projects && Array.isArray(cust.projects)) {
      setProjects(cust.projects);
      // If your full profile doesn't include pagination metadata for projects, 
      // you can derive it from the array length:
      setProjectsCount(cust.metadata?.totalProjects || cust.projects.length);
      setProjectsPages(cust.metadata?.projectPages || 1);
    }

    if (cust.opportunities && Array.isArray(cust.opportunities)) {
      setOpportunities(cust.opportunities);
      setOpportunitiesCount(
        cust.metadata?.totalOpportunities ?? cust.opportunities.length
      );
    } else {
      setOpportunities([]);
      setOpportunitiesCount(0);
    }

    // --- NEW: Map Tickets ---
    if (cust.tickets && Array.isArray(cust.tickets)) {
      setTickets(cust.tickets);
      setTicketsCount(
        cust.metadata?.totalTickets ?? cust.tickets.length
      );
    } else {
      setTickets([]);
      setTicketsCount(0);
    }

    const base = {
      customerId: cust.customerId,
      custType: cust.custType,
      status: cust.status || 'Active',
      dateJoined: cust.dateJoined || '—',
      // These could eventually come from API summary fields
      lastContact: cust.interactions?.[0]?.interactionDate || '—',
      totalPurchases: cust.totalPurchases || '$0',
      lifetimeValue: cust.lifetimeValue || '$0',
    };

    if (cust.custType === 'B2B' && cust.b2b) {
      const b2bData = { ...cust.b2b };
      const primary = b2bData.contacts?.find((c) => c.id === b2bData.primaryContactId) || {};

      setCustomerData({
        ...base,
        b2b: b2bData,
        firstName: primary.firstName || '—',
        lastName: primary.secondName || '',
        email: primary.email || '—',
        phone: primary.phone || '—',
        position: primary.jobTitle || '—',
        company: b2bData.companyName || '—',
        street: b2bData.street || '', city: b2bData.city || '', state: b2bData.state || '',
        zipCode: b2bData.zipCode || '', country: b2bData.country || '',
      });
    } else if (cust.custType === 'B2C' && cust.b2c) {
      const addr = cust.b2c.addresses?.[0] || {};
      setCustomerData({
        ...base,
        firstName: cust.b2c.firstName || '—',
        lastName: cust.b2c.lastName || '',
        email: cust.b2c.email || '—',
        phone: cust.b2c.phone || '—',
        position: 'Individual Customer',
        company: '',
        street: addr.street || '', city: addr.city || '', state: addr.state || '',
        zipCode: addr.zipCode || '', country: addr.country || '',
      });
    }
  }, []);

  // Optional: Refresh customer data after any update
  const refreshCustomerData = async () => {
    try {
      const params = { id: customerData.customerId };
      const response = await getCustomers(token, params);
      const updatedData = response.data?.data?.[0];

      if (updatedData) {
        updateTabCustomer(updatedData.customerId, updatedData);
        mapCustomerToDisplay(updatedData);

      }
    } catch (error) {
      console.error('Error refreshing customer data', error);
    }
  };

  /* -------------------------------------------------------
     EFFECTS
  ------------------------------------------------------- */
  // Initial Load
  /* -------------------------------------------------------
     EFFECTS (Updated for Profile Sync)
 ------------------------------------------------------- */
  /* -------------------------------------------------------
      EFFECTS (Fixed to prevent 401 race conditions)
  ------------------------------------------------------- */
  useEffect(() => {
    setActiveTab('overview');
  }, [id]); // Triggers whenever the URL ID changes

  useEffect(() => {
    // 1. HARD GUARD: If no token or no ID, do nothing.
    if (!id || !token) {
      return;
    }

    const customerId = Number.parseInt(id, 10);
    let cancelled = false;

    const load = async () => {
      // 2. Logic to check for existing data without putting 'tabs' in dependency array
      // We check the 'tabs' state only once when the effect fires
      const existingTab = tabs.find(t => t.customerId === customerId);
      const targetCustomer = existingTab?.customer;

      if (targetCustomer && targetCustomer.interactions) {
        console.log("Using cached data for customer:", targetCustomer);
        mapCustomerToDisplay(targetCustomer);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 3. The API call is now safe because we verified 'token' above
        const res = await getCustomerProfile(customerId, token);

        if (cancelled) return;

        const fullCustomer = res.data?.data?.[0] || res.data;
        if (fullCustomer) {
          console.log("Using FullCustomer data for customer:", fullCustomer);
          mapCustomerToDisplay(fullCustomer);
          updateTabCustomer(customerId, fullCustomer);

        }
      } catch (err) {
        // If we catch a 401 here, your Auth redirect logic handles it
        console.error('Fetch error in CustomerInfo:', err);
      } finally {
        if (!cancelled) setLoading(false);
        loadCustomerProjects();
      }
    };

    load();

    return () => { cancelled = true; };
    // REMOVED 'tabs' and 'getActiveTab' to prevent re-triggering loops
  }, [id, token, mapCustomerToDisplay, updateTabCustomer]);

  // Load Projects when 'projects' tab is active
  // useEffect(() => {
  //   if (activeTab === 'projects' && customerData.customerId) {
  //     loadCustomerProjects();
  //   }
  // }, [activeTab, customerData.customerId]);


  /* -------------------------------------------------------
     HANDLERS
  ------------------------------------------------------- */

  // --- Contact Handlers ---
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
    const isPrimary = contactId === customerData.b2b?.primaryContactId;
    if (isPrimary) {
      alert("Cannot delete the primary contact. Please set another contact as primary first.");
      return;
    }
    const confirmed = window.confirm('Are you sure you want to delete this contact?');
    if (!confirmed) return;

    try {
      setLoading(true);
      await deleteContact(token, customerData.customerId, contactId);
      alert('Contact deleted successfully!');
      refreshCustomerData();
    } catch (error) {
      console.error('Error deleting contact', error);
      alert('Failed to delete contact. It might be in use or you may have lost your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimaryContact = async (contactId) => {
    try {
      const response = await setPrimaryContact(token, customerData.customerId, contactId);
      console.log('Set primary contact response:', response);
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





  // --- Overview/Edit Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Customer information saved!');
    // TODO: Add API call to save customer data
  };

  const handleCancel = () => {
    setIsEditing(false);
    // TODO: Revert changes if necessary
  };



  // --- Project Handlers ---
  const loadCustomerProjects = async (page = 0) => {
    try {
      setLoading(true);
      const response = await getProjectsByCustomerApi(token, customerData.customerId, page);
      if (response.data && response.data.data) {
        setProjects(response.data.data);
        setProjectsPages(response.data.totalPages);
        setProjectsCount(response.data.totalCount);
      } else {
        setProjects([]);
        setProjectsPages(0);
        setProjectsCount(0);
      }
    } catch (error) {
      console.error("Error loading paginated projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'OPEN': return '#4299e1'; // Blue
      case 'IN_PROGRESS': return '#ed8936'; // Orange
      case 'CLOSED': return '#48bb78'; // Green
      case 'CANCELLED': return '#e53e3e'; // Red
      default: return '#cbd5e0'; // Grey
    }
  };



  //   To Open the New Project Model  
  const handleAddNewProject = () => {
    setSelectedProject(null);
    setShowProjectModal(true);
  };

  // When Creating the Project
  const handleCreateProject = async (projectDto) => {
    try {
      setLoading(true);
      await createProjectApi(token, customerData.customerId, projectDto);
      setShowProjectModal(false);
      alert('Project created successfully!');
      // await refreshCustomerData();
      await loadCustomerProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  // --- New Inline Task Handler ---
  const handleAddNewTask = (projectId) => {
    const newTaskTemplate = {
      projectSubId: `temp-${Date.now()}`, // Unique temp ID for React keys
      subName: '',
      priority: 2,
      budget: 0,
      status: 'OPEN',
      isNew: true // Flag to tell the modal this is a new, unsaved row
    };

    // 1. Update the projects array in state
    setProjects(prevProjects =>
      prevProjects.map(proj => {
        if (proj.projectId === projectId) {
          return {
            ...proj,
            details: [newTaskTemplate, ...(proj.details || [])]
          };
        }
        return proj;
      })
    );

    // 2. Sync the SelectedProject so the Modal opens with the new row
    const targetProject = projects.find(p => p.projectId === projectId);
    if (targetProject) {
      setSelectedProject({
        ...targetProject,
        details: [newTaskTemplate, ...(targetProject.details || [])]
      });
    }

    // 3. Open the Modal
    setShowProjectModal(true);
  };

  const handleDeleteProject = async (projectId) => {
    // 1. Confirmation Guard
    const confirmed = window.confirm("Are you sure? This will delete all sub-tasks and project data permanently.");
    if (!confirmed) return;
    try {
      // 2. Start Loading (Triggers your LoadingModal)
      setLoading(true);
      // 3. API Call
      await deleteProjectApi(token, projectId);
      // 4. Success Feedback (Optional but helpful)
      console.log(`Project ${projectId} deleted successfully`);
      // 5. Refresh the UI
      // This pulls the fresh list from the server to ensure the UI is in sync
      await loadCustomerProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please check your connection and try again.');
    } finally {
      // 6. Stop Loading (Hides LoadingModal)
      setLoading(false);
    }
  };


  const handleSaveTask = async (projectId, detailObj) => {
    try {
      setLoading(true);

      // PRIORITY MAPPING LOGIC
      const priorityMap = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };

      let finalPriority = detailObj.priority;

      // If for some reason it's a string, convert it. If empty/null, default to 2.
      if (typeof finalPriority === 'string') {
        finalPriority = priorityMap[finalPriority.toUpperCase()] || 2;
      } else if (!finalPriority) {
        finalPriority = 2;
      }

      const detailDto = {
        subName: detailObj.subName || "New Task",
        status: detailObj.status || "OPEN",
        priority: finalPriority, // Guaranteed to be 1, 2, or 3
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
    // 1. Check if it's a temporary row (starts with 'temp-')
    const isTemporary = String(detailId).startsWith('temp-');

    if (isTemporary) {
      // Just remove it from the local state immediately
      setProjects(prevProjects =>
        prevProjects.map(proj => ({
          ...proj,
          details: proj.details.filter(d => d.projectSubId !== detailId)
        }))
      );

      // Also update selectedProject so the Modal refreshes
      setSelectedProject(prev => ({
        ...prev,
        details: prev.details.filter(d => d.projectSubId !== detailId)
      }));
      return;
    }

    // 2. If it's a real task, ask for confirmation
    const confirmed = window.confirm("Are you sure you want to delete this sub-task?");
    if (!confirmed) return;

    try {
      setLoading(true); // Show your LoadingModal

      // 3. Call the API
      await deleteProjectDetailApi(token, detailId);

      // 4. Refresh data from server
      await loadCustomerProjects();

      // 5. Sync the Modal state so the row disappears
      if (selectedProject) {
        const updatedDetails = selectedProject.details.filter(d => d.projectSubId !== detailId);
        setSelectedProject({ ...selectedProject, details: updatedDetails });
      }

    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete the task. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const [updatingDetailId, setUpdatingDetailId] = useState(null);

  const handleUpdateDetail = async (subId, updatedFields) => {
    try {
      await updateProjectDetailApi(token, subId, updatedFields);

      setProjects(prevProjects =>
        prevProjects.map(proj => {
          if (proj.details?.some(d => d.projectSubId === subId)) {
            // Update the sub-task
            const updatedDetails = proj.details.map(d =>
              d.projectSubId === subId ? { ...d, ...updatedFields } : d
            );

            // RE-CALCULATE Project Status here so the UI sees it
            const allDone = updatedDetails.every(d => d.status === 'COMPLETED');
            const anyStarted = updatedDetails.some(d => d.status === 'IN_PROGRESS' || d.status === 'COMPLETED');
            const newStatus = allDone ? 'CLOSED' : (anyStarted ? 'IN_PROGRESS' : 'OPEN');

            const updatedProj = { ...proj, details: updatedDetails, status: newStatus };

            // Sync the Modal view
            setSelectedProject(updatedProj);
            return updatedProj;
          }
          return proj;
        })
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleCloseProjectModal = () => {
    // Check if any sub-tasks have the isNew flag
    const hasUnsavedTasks = selectedProject?.details?.some(detail => detail.isNew);

    if (hasUnsavedTasks) {
      const proceed = window.confirm(
        "You have an unsaved task row. Closing will discard this new entry. Do you want to proceed?"
      );
      if (!proceed) return; // Keep modal open
    }

    // If no unsaved tasks or user confirmed, close and reset
    setShowProjectModal(false);
    setSelectedProject(null);

    // Optional: Refresh data to clear any local temp rows from the main projects state
    loadCustomerProjects();
  };

  // --- Render Logic ---
  // if (loading) {
  //   return <div className="page-loading">Loading customer...</div>;
  // }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            customerData={customerData}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
          />
        );
      case 'activity':
        return <ActivityTab activities={activities} />;
      case 'purchases':
        return <PurchasesTab purchases={purchases} />;
      case 'notes':
        return <NotesTab notes={notes} />;
      case 'documents':
        return <DocumentsTab />;
      case 'projects':
        return (
          <ProjectsTab
            projects={projects}
            handleAddNewProject={handleAddNewProject}
            getStatusColor={getStatusColor}
            setSelectedProject={setSelectedProject}
            setShowProjectModal={setShowProjectModal}
            handleDeleteProject={handleDeleteProject}
            handleAddNewTaskRow={handleAddNewTask}

          />
        );
      case 'contacts':
        return (
          <ContactsTab
            customerData={customerData}
            setShowAddModal={setShowAddModal}
            handleDeleteContact={handleDeleteContact}
            handleSetPrimaryContact={handleSetPrimaryContact}
          />
        );
      case 'tickets':
        return (
          <Tickets
            tickets={tickets}
            totalCount={ticketsCount}
          />
        );

      case 'opportunities':
        return (
          <Opportunities
            opportunities={opportunities}
            totalCount={opportunitiesCount}
          />
        );

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="customer-info-container">
      <CustomerHeader
        customerData={customerData}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />

      <QuickActions />

      <div className="tabs-container">
        <CustomerTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          customerData={customerData}
        />

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddContactModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddContact}
        />
      )}

      {showProjectModal && (
        <ProjectModal
          isOpen={showProjectModal}
          onClose={handleCloseProjectModal}
          project={selectedProject}
          onSave={handleCreateProject}
          onDelete={handleDeleteProject}
          onAddDetail={handleAddNewTask}
          onSaveDetail={handleSaveTask}
          onDeleteDetail={handleDeleteTask}
          onUpdateDetail={handleUpdateDetail}
          updatingDetailId={updatingDetailId}
        // Assuming ProjectModal needs other props like handleAddDetail, handleDeleteDetail, etc.
        />
      )}

      {/* Global Loading Modal for API Actions */}
      <LoadingModal
        isOpen={loading}
        message={activeTab === 'projects' ? "Updating Projects..." : "Loading..."}
      />
    </div>
  );
};

export default CustomerInfo;
