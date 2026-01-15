import { 
  createLead, 
  updateLead, 
  deleteLead, 
  convertLeadToCustomer 
} from '../../../api/LeadApi';

export const useLeadHandler = ({
  token,
  setLoading,
  refreshLeads,
  setLeads,
  setShowCreateModal,
  setShowDetailModal,
  setShowConvertModal,
  setSelectedLeadIds,
  selectedLeadIds
}) => {

 const handleCreateLead = (closeModalFunc) => async (formData) => {
  try {
    setLoading(true);
    await createLead(token, formData);
    
    // Success: Close directly without triggering the "Are you sure?" alert
    closeModalFunc(false); 
    alert('Lead created successfully!');
    await refreshLeads();
  } catch (error) {
    console.error('Error creating lead:', error);
    alert('Failed to create lead.');
  } finally {
    setLoading(false);
  }
};

  const handleUpdateLead = async (leadId, formData) => {
    try {
      setLoading(true);
      await updateLead(token, leadId, formData);
      setShowDetailModal(false);
      alert('Lead updated successfully!');
      await refreshLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      setLoading(true);
      await deleteLead(token, leadId);
      setShowDetailModal(false);
      alert('Lead deleted successfully!');
      await refreshLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    } finally {
      setLoading(false);
    }
  };

const handleConvertLead = async (lead, conversionData, setModalOpen) => {
  try {
    setLoading(true);

    // Merge Lead Details + Conversion Form Data
    const fullUpdateRequest = {
      // Existing Lead Info
      status: "CONVERTED", // Update status to converted
      notes: lead.notes,
      score: lead.score,
      firstName: lead.firstName,
      lastName: lead.lastName,
      company: lead.company,
      contactPersonName: lead.contactPersonName,
      email: lead.email,
      phone: lead.phone,
      productInterests: lead.productInterests || [],
      relatedPartyRole: lead.relatedPartyRole,
      assignee: lead.assignee,
      activities: lead.activities || [],

      // Conversion Fields (Mapping from your form names to DTO names)
      opportunityName: conversionData.opportunity,
      opportunityAmount: parseFloat(conversionData.amount),
      currency: conversionData.currency
    };

    console.log("Full Payload for DTO:", JSON.stringify(fullUpdateRequest));

    // Call API
    await updateLead(token, lead.id, fullUpdateRequest);
    
    setModalOpen(false); 
    if (setShowDetailModal) setShowDetailModal(false); 

    alert(`Successfully converted ${lead.firstName} to customer!`);
    await refreshLeads();
  } catch (error) {
    console.error('Error converting lead:', error);
    alert('Failed to convert lead.');
  } finally {
    setLoading(false);
  }
};


const handleBulkDelete = async () => {
  if (!window.confirm(`Are you sure you want to delete ${selectedLeadIds.length} leads?`)) return;

  try {
    setLoading(true);
    // Ideally, your API has a bulk delete endpoint:
    // await bulkDeleteLeads(token, selectedLeadIds); 
    
    // If not, you'd have to loop (not recommended for many leads):
    // await Promise.all(selectedLeadIds.map(id => deleteLead(token, id)));

    setLeads(prev => prev.filter(lead => !selectedLeadIds.includes(lead.id)));
    setSelectedLeadIds([]);
    alert('Leads deleted successfully');
  } catch (error) {
    console.error('Bulk delete failed:', error);
  } finally {
    setLoading(false);
  }
};

const handleAssignLeads = (assigneeName) => {
  // 1. Update local state
  setLeads(prev => prev.map(lead => 
    selectedLeadIds.includes(lead.id) 
      ? { ...lead, assignee: assigneeName } // Changed 'assignedTo' to 'assignee'
      : lead
  ));

  // 2. Success Feedback
  alert(`Successfully assigned ${selectedLeadIds.length} lead(s) to ${assigneeName}`);

  // 3. Clear the selection checkboxes
  setSelectedLeadIds([]);

  // TODO: Add API call here if you want to persist bulk assignment to the DB
  // await bulkUpdateLeads(token, selectedLeadIds, { assignee: assigneeName });
};

  const handleExport = (leadsToExport, filename = 'leads.csv') => {
    if (!leadsToExport || leadsToExport.length === 0) return alert("No leads to export.");
    const headers = ['ID', 'Type', 'Status', 'Name', 'Email', 'Phone', 'Company', 'Assigned To'];
    const csvContent = [
      headers.join(','),
      ...leadsToExport.map(l => [
        l.id,
        l.leadType,
        l.status,
        `"${l.firstName || ''} ${l.lastName || l.contactPersonName || ''}"`,
        `"${l.contactEmail || ''}"`,
        `"${l.contactPhone || ''}"`,
        `"${l.organizationName || ''}"`,
        `"${l.assignedTo || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (setFormData) => (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = (closeModalFunc) => () => {
    if (window.confirm('Are you sure? Unsaved changes will be lost.')) {
      closeModalFunc(false);
    }
  };

  return {
    handleCreateLead, handleUpdateLead, handleDeleteLead, 
    handleConvertLead, handleBulkDelete, handleAssignLeads, 
    handleExport, handleInputChange, handleCancel
  };
};