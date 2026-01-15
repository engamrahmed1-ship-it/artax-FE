import React, { useState, useMemo, useEffect } from 'react';
import { getAllLeads } from '../../api/LeadApi';
import { useLeadHandler } from './hooks/useLeadHandler';
import LeadCard from './components/LeadCard';
import SearchBar from './components/SearchBar';
import LeadDetailModal from './components/LeadDetailModal';
import ConvertToCustomer from './components/ConvertToCustomer';
import CreateLeadModal from './components/CreateLeadModal';
import { BulkActionsToolbar } from './components/BulkActionsToolbar';
import { AssignLeadModal } from './components/AssignLeadModal';
import { ConfirmDeleteDialog } from './components/ConfirmDeleteDialog';
import './css/leads.css';
import { useAuth } from '../../hooks/useAuth';
import { mockLeads } from './mock/mockLeads';

const Leads = () => {
  // const [leads, setLeads] = useState([]); // Initialize as empty array
  const [leads, setLeads] = useState(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // const token = localStorage.getItem('token');

  const { token } = useAuth();

  /**
   * Fetches BE data and merges it with Mock data
   */
  const refreshLeads = async () => {
    try {
      setLoading(true);
      const response = await getAllLeads(token);

      // Extract array from BE structure: { leads: { data: [...] } }
      const apiLeads = response?.data?.data || [];
      console.log("Fetched leads from API:", apiLeads);

      setLeads((prevLeads) => {
        // Merge Mock + API leads
        const combined = [...mockLeads, ...apiLeads];

        // Remove duplicates based on ID
        const uniqueLeads = Array.from(
          new Map(combined.map(lead => [lead.id, lead])).values()
        );

        return uniqueLeads;
      });
    } catch (error) {
      console.error('Error fetching leads, falling back to mock only:', error);
      setLeads(mockLeads);
    } finally {
      setLoading(false);
    }
  };

  const leadHandler = useLeadHandler({
    token, setLoading, refreshLeads, setLeads,
    setShowCreateModal, setShowDetailModal: setIsDetailModalOpen,
    setShowConvertModal: setIsConvertModalOpen,
    setSelectedLeadIds, selectedLeadIds
  });

  useEffect(() => {
    refreshLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    // Ensure leads is an array before filtering
    if (!Array.isArray(leads)) return [];

    console.log("Filtering leads with searchTerm:", searchTerm,
      "and statusFilter:", statusFilter);
    console.log("Current leads:", leads);

    return leads.filter((lead) => {
      const fullName = `${lead.firstName || ''} ${lead.lastName || ''} ${lead.contactPersonName || ''} ${lead.name || ''}`.toLowerCase();
      const phone = (lead.contactPhone || '').toLowerCase();

      console.log("Evaluating lead:", fullName, phone);
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm.toLowerCase());

      console.log("Lead:", lead, "matchesSearch:", matchesSearch);

      const matchesStatus =
        statusFilter === 'All' ||
        lead.status?.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  const handleExportAll = () => {
    leadHandler.handleExport(filteredLeads, `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="leads-container">
      <div className="leads-header">
        <div className="header-content">
          <span className="header-icon">👥</span>
          <div>
            <h1 className="header-title">Leads Management</h1>
            <p className="header-subtitle">Manage and track your sales leads</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>+ Create Lead</button>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onExportAll={handleExportAll}
      />

      <div className="leads-grid">
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onClick={() => { setSelectedLead(lead); setIsDetailModalOpen(true); }}
            onDelete={leadHandler.handleDeleteLead}
            isSelected={selectedLeadIds.includes(lead.id)}
            onSelect={(id, checked) => {
              setSelectedLeadIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
            }}
          />
        ))}
      </div>

      <LeadDetailModal
        lead={selectedLead}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onConvert={() => { setIsDetailModalOpen(false); setIsConvertModalOpen(true); }}
        onEdit={leadHandler.handleUpdateLead}
      />


      {selectedLead && (
        <ConvertToCustomer
          isOpen={isConvertModalOpen}
          onClose={() => setIsConvertModalOpen(false)}
          leadName={`${selectedLead.firstName || ''} ${selectedLead.lastName || ''}`}
          onSubmit={(conversionData) =>
            // PASS THE WHOLE selectedLead OBJECT HERE
            leadHandler.handleConvertLead(selectedLead, conversionData, setIsConvertModalOpen)
          }
        />
      )}

      <CreateLeadModal
        isOpen={showCreateModal}
        onClose={leadHandler.handleCancel(setShowCreateModal)} // Triggers confirmation
        onSave={leadHandler.handleCreateLead(setShowCreateModal)} // Closes silently on success
      />

      <BulkActionsToolbar
        selectedCount={selectedLeadIds.length}
        onDelete={() => setShowBulkDeleteDialog(true)}
        onAssign={() => setShowAssignModal(true)}
        onExport={() => leadHandler.handleExport(leads.filter(l => selectedLeadIds.includes(l.id)))}
        onClearSelection={() => setSelectedLeadIds([])}
      />

      <AssignLeadModal
        open={showAssignModal}
        onOpenChange={setShowAssignModal}
        leads={leads.filter(l => selectedLeadIds.includes(l.id))} // ADD THIS
        onAssign={(name) => {
          leadHandler.handleAssignLeads(name);
          setShowAssignModal(false);
        }}
      />

      <ConfirmDeleteDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        onConfirm={() => { leadHandler.handleBulkDelete(); setShowBulkDeleteDialog(false); }}
        isMultiple={true}
      />

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner-container">
            <div className="spinner-ring"></div>
            <span className="loading-text">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;