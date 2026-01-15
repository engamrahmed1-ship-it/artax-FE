/**
 * Utility to flatten and format raw API data into a structure
 * compatible with the UI (OverviewTab, StatCards, etc.)
 */
export const mapCustomerToUI = (cust) => {
  if (!cust) return null;

  const getArray = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (field.data && Array.isArray(field.data)) return field.data;
    return [];
  };

  // 1. Extract the core customer object
  const mainCustomer = cust.customer?.data?.[0] || cust.customer || cust;
  const isB2C = mainCustomer.custType === 'B2C';

  // 2. Map Related Lists
  const rawInteractions = getArray(cust.interactions);
  const activities = rawInteractions.map(item => ({
    id: item.interactionId,
    // Ensure this matches the CSS classes in your ActivityTab (call, email, etc.)
    type: item.interactionType?.toLowerCase() || 'call',

    // Use interactionDate if available, otherwise fallback to creation date
    date: item.interactionDate || item.createdAt || 'Just now',

    // UI Improvements: Show Subject prominently
    subject: item.subject || `${item.interactionType} Log`,

    // Description: Combine description/notes for the timeline view
    description: item.description || item.notes || 'No details provided.',

    outcome: item.outcome || null,
    notes: item.notes || null,
    agentId: item.agentId
  }));


  // --- Update within mapCustomerToUI ---

  const rawDocuments = getArray(cust.documents);
  const documents = rawDocuments.map(doc => ({
    documentId: doc.documentId,
    fileName: doc.documentName,     // Map BE documentName -> FE fileName
   docType: doc.documentType || 'OTHER',      // Map BE documentType -> FE docType
   projectId: doc.projectId,
    uploadDate: doc.createdAt,      // Map BE createdAt -> FE uploadDate
    fileSize: doc.fileSize,
    formattedSize: doc.formattedSize // Use the BE pre-formatted size
  }));

  // Updated Mock Data Fallback to match BE Structure
  const finalDocuments = documents.length > 0 ? documents : [
    {
      documentId: 101,
      documentName: 'Service_Agreement.pdf',
      documentType: 'CONTRACT',
      createdAt: '2025-11-15T10:00:00Z',
      formattedSize: '1.2 MB'
    },
    {
      documentId: 102,
      documentName: 'Project_Scope.docx',
      documentType: 'PROPOSAL',
      createdAt: '2025-12-28T14:30:00Z',
      formattedSize: '450 KB'
    }
  ].map(mock => ({
    documentId: mock.documentId,
    fileName: mock.documentName,
    docType: mock.documentType,
    uploadDate: mock.createdAt,
    formattedSize: mock.formattedSize
  }));


  const projects = getArray(cust.projects);
  const opportunities = getArray(cust.opportunities);
  const tickets = getArray(cust.tickets);
  const notes = getArray(cust.notes);  

  // 3. Base UI Structure
  const base = {
    customerId: mainCustomer.customerId,
    custType: mainCustomer.custType,
    status: mainCustomer.status || 'Active',
    dateJoined: mainCustomer.dateJoined || '—',
    lastContact: rawInteractions[0]?.interactionDate || '—',
    totalPurchases: mainCustomer.totalPipeline || 0,
    lifetimeValue: mainCustomer.weightedForecast || 0,
  };

  // 4. Type-Specific Flattening and Nesting
  let typeSpecificFields = {};

  if (isB2C && mainCustomer.b2c) {
    const b2c = mainCustomer.b2c;
    const addr = getArray(b2c.addresses)[0] || {};

    typeSpecificFields = {
      b2c: {
        ...b2c,
        title: b2c.title || '',
        secondName: b2c.secondName || '',
        custCategory: b2c.custCategory || '',
        idType: b2c.idType || '',
        idNumber: b2c.idNumber || '',
        birthdate: b2c.birthdate || '',
        gender: b2c.gender || '',
      },
      b2b: null,
      firstName: b2c.firstName || '',
      lastName: b2c.lastName || '',
      email: b2c.email || '',
      phone: b2c.phone || '',
      position: 'Individual Customer',
      company: '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zipCode: addr.zipCode || '',
      country: addr.country || '',
    };
  } else if (!isB2C && mainCustomer.b2b) {
    const b2b = mainCustomer.b2b;
    const contacts = getArray(b2b.contacts);
    const primary = contacts.find(c => c.id === b2b.primaryContactId) || contacts[0] || {};

    typeSpecificFields = {
      // THE FIX: Explicitly initialize these B2B fields so they aren't undefined
      b2b: {
        ...b2b,
        commercialRegister: b2b.commercialRegister || '',
        website: b2b.website || '',
        industry: b2b.industry || '',
        companyClass: b2b.companyClass || '',
        companySize: b2b.companySize || '',
        primaryContactId: b2b.primaryContactId || null
      },
      b2c: null,
      firstName: primary.firstName || '',
      lastName: primary.lastName || '',
      email: primary.email || '',
      phone: primary.phone || '',
      position: primary.jobTitle || primary.position || '',
      company: b2b.companyName || '',
      street: b2b.street || '',
      city: b2b.city || '',
      state: b2b.state || '',
      zipCode: b2b.zipCode || '',
      country: b2b.country || '',
    };
  }

  return {
    uiData: { ...base, ...typeSpecificFields },
    activities,
    projects,
    opportunities,
    tickets,
    documents: finalDocuments, // Added here
    notes,
    counts: {
      projects: cust.projects?.totalCount || mainCustomer.metadata?.totalProjects || projects.length,
      opportunities: cust.opportunities?.totalCount || mainCustomer.metadata?.totalOpportunities || opportunities.length,
      tickets: cust.tickets?.totalCount || mainCustomer.metadata?.totalTickets || tickets.length,
    }
  };
};