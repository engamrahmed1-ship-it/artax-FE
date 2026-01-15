import React, { useCallback, useEffect, useState } from 'react';
import "./css/customerInfo.css"
import { useParams } from 'react-router-dom';
import { useTabContext } from '../../context/TabContext';
import { getCustomerProfile } from '../../api/CustomerApi';
import { useAuth } from '../../hooks/useAuth';
import { getProjectsByCustomerApi } from '../../api/ProjectApi';

// Handlers Hook
import { useCustomerHandlers } from './hooks/useCustomerHandlers';

// Components & Tabs
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
import { mapCustomerToUI } from './utils/customerMapper';
import { set } from 'react-hook-form';

const CustomerInfo = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { tabs, updateTabCustomer } = useTabContext();

  // --- State ---
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [projects, setProjects] = useState([]);
  const [projectsPages, setProjectsPages] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  // --- Add these new states ---
  const [activitiesPages, setActivitiesPages] = useState(0);
  const [activitiesCurrentPage, setActivitiesCurrentPage] = useState(0);
  const [activities, setActivities] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [opportunitiesCount, setOpportunitiesCount] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [ticketsCount, setTicketsCount] = useState(0);
  const [notes, setNotes] = useState([
    { id: 1, author: "System", content: "Account created", date: "2023-01-01", tags: ["General"] }
  ]);
  const [purchases, setPurchases] = useState([{ id: 1, date: '2024-10-15', product: 'Enterprise License', amount: '$12,000', status: 'Completed' }]);

  const [customerData, setCustomerData] = useState({
    customerId: null, custType: null, firstName: '', lastName: '', email: '', phone: '',
    company: '', position: '', status: 'Active', street: '', city: '', state: '',
    zipCode: '', country: '', dateJoined: '—', lastContact: '—', totalPurchases: '—',
    lifetimeValue: '—', b2b: null,
  });



  // --- Data Logic ---
  const mapCustomerToDisplay = useCallback((cust) => {
    const result = mapCustomerToUI(cust);
    if (!result) return;
    setCustomerData(result.uiData);
    setActivities(result.activities);
    setProjects(result.projects);
    setOpportunities(result.opportunities);
    setTickets(result.tickets);
    setDocuments(result.documents);
    setNotes(result.notes);
    setProjectsCount(result.counts.projects);
    setOpportunitiesCount(result.counts.opportunities);
    setTicketsCount(result.counts.tickets);
  }, []);

  const refreshCustomerData = async () => {
    try {
      setLoading(true);
      const response = await getCustomerProfile(token, id);
      const updatedData = response.data?.data?.[0] || response.data;
      if (updatedData) {
        updateTabCustomer(Number(id), updatedData);
        mapCustomerToDisplay(updatedData);
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerProjects = useCallback(async (page = 0) => {
    if (!id || !token) return;
    try {
      setLoading(true);
      const response = await getProjectsByCustomerApi(token, id, page);
      if (response.data && response.data.data) {
        setProjects(response.data.data);
        setProjectsPages(response.data.totalPages || 1);
        setProjectsCount(response.data.totalCount || 0);
      }
    } catch (error) {
      console.error("Error loading paginated projects:", error);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  // Initialize Handlers
  const handlers = useCustomerHandlers({
    token, customerData, setCustomerData, setIsEditing, isEditing,
    setActiveTab, setLoading, projects, setProjects, setSelectedProject,
    selectedProject, setShowProjectModal, setShowAddModal, refreshCustomerData,
    loadCustomerProjects, mapCustomerToDisplay, updateTabCustomer, setNotes
  });

  // --- Effects ---
  useEffect(() => {
    if (!id || !token) return;
    const customerId = Number.parseInt(id, 10);
    let cancelled = false;

    setActiveTab('overview');
    setIsEditing(false);

    const loadData = async () => {
      const existingTab = tabs.find(t => t.customerId === customerId);
      if (existingTab?.customer?.interactions) {
        mapCustomerToDisplay(existingTab.customer);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await getCustomerProfile(token, customerId);
        if (cancelled) return;
        const fullCustomer = res.data?.data?.[0] || res.data;
        if (fullCustomer) {
          mapCustomerToDisplay(fullCustomer);
          updateTabCustomer(customerId, fullCustomer);
        }
      } catch (err) {
        console.error('Initial Load Error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => { cancelled = true; };
  }, [id, token, mapCustomerToDisplay, tabs, updateTabCustomer]);

  useEffect(() => {
    window.isCustomerEditing = isEditing;
    const handleBeforeUnload = (e) => { if (isEditing) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => { window.removeEventListener('beforeunload', handleBeforeUnload); window.isCustomerEditing = false; };
  }, [isEditing]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab customerData={customerData} isEditing={isEditing} handleInputChange={handlers.handleInputChange} />;
      case 'activity':
        return (
          <ActivityTab
            activities={activities}
            totalPages={activitiesPages}
            currentPage={activitiesCurrentPage}
            onPageChange={handlers.loadCustomerActivities} // This is the logic to change page
            onAddActivity={handlers.handleAddActivity}
            onDeleteActivity={handlers.handleDeleteActivity}
          />
        ); case 'purchases': return <PurchasesTab purchases={purchases} />;
      case 'notes': return (
        <NotesTab
          notes={notes}
          onDeleteNote={handlers.handleDeleteNote}
          onAddNote={handlers.handleAddNote}
          onUpdateNote={handlers.handleUpdateNote} // <--- ADD THIS PROP
        />
      );
      case 'documents':
        return (
          <DocumentsTab
            documents={documents || []} // Ensure your mapper includes documents
            projects={projects || []} // Pass the full projects array here
            onUpload={handlers.handleUploadDocument}
            token={token}
            onDownload={handlers.handleDownloadDocument}
            onDelete={handlers.handleDeleteDocument}
            onUpdateProject={handlers.handleUpdateDocumentProject}
          />
        );
      case 'projects': return (
        <ProjectsTab
          projects={projects}
          handleAddNewProject={() => { setSelectedProject(null); setShowProjectModal(true); }}
          getStatusColor={(s) => ({ 'OPEN': '#4299e1', 'IN_PROGRESS': '#ed8936', 'CLOSED': '#48bb78', 'CANCELLED': '#e53e3e' }[s?.toUpperCase()] || '#cbd5e0')}
          setSelectedProject={setSelectedProject}
          setShowProjectModal={setShowProjectModal}
          handleDeleteProject={handlers.handleDeleteProject}
          handleAddNewTaskRow={handlers.handleAddNewTask}
        />
      );
      case 'contacts': return (
        <ContactsTab
          customerData={customerData}
          setShowAddModal={setShowAddModal}
          handleDeleteContact={handlers.handleDeleteContact}
          handleSetPrimaryContact={handlers.handleSetPrimaryContact}
        />
      );
      case 'tickets': return (
        <Tickets
          token={token}
          tickets={tickets}
          totalCount={ticketsCount}
          onSave={handlers.handleSaveTicket}
          onDelete={handlers.handleDeleteTicket}
        />
      );
      case 'opportunities': return (
        <Opportunities
          customerId={customerData.customerId}
          opportunities={opportunities}
          totalCount={opportunitiesCount}
          onSave={handlers.handleSaveOpportunity}
          onDelete={handlers.handleDeleteOpportunity}
          onRefresh={refreshCustomerData}
        />
      );
      default: return <div>Select a tab</div>;
    }
  };

  return (
    <div className="customer-info-container">
      <CustomerHeader customerData={customerData} isEditing={isEditing} setIsEditing={setIsEditing} handleSave={handlers.handleSave} handleCancel={handlers.handleCancel} />
      {/* <QuickActions /> */}
      <div className="tabs-container">
        <CustomerTabs activeTab={activeTab} setActiveTab={handlers.handleSubTabChange} customerData={customerData} />
        <div className="tab-content">{renderTabContent()}</div>
      </div>

      {showAddModal && <AddContactModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handlers.handleAddContact} />}
      {showProjectModal && (
        <ProjectModal
          isOpen={showProjectModal}
          onClose={() => { setShowProjectModal(false); setSelectedProject(null); loadCustomerProjects(); }}
          project={selectedProject}
          onSave={handlers.handleCreateProject}
          onDelete={handlers.handleDeleteProject}
          onAddDetail={handlers.handleAddNewTask}
          onSaveDetail={handlers.handleSaveTask}
          onDeleteDetail={handlers.handleDeleteTask}
          onUpdateDetail={handlers.handleUpdateDetail}
        />
      )}

      <LoadingModal isOpen={loading} message={activeTab === 'projects' ? "Updating Projects..." : "Loading..."} />
    </div>
  );
};

export default CustomerInfo;