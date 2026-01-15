// Lead status types
export const LEAD_STATUS = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  LOST: 'Lost'
};

// Lead interface structure
export const createLead = (data) => ({
  id: data.id || '',
  name: data.name || '',
  email: data.email || '',
  phone: data.phone || '',
  company: data.company || '',
  status: data.status || LEAD_STATUS.NEW,
  source: data.source || '',
  createdAt: data.createdAt || new Date().toISOString(),
  notes: data.notes || ''
});

// Conversion data structure
export const createConversionData = (data) => ({
  amount: data.amount || 0,
  opportunity: data.opportunity || '',
  currency: data.currency || 'USD'
});