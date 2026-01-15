# Lead Management Module

## Structure Overview

```
lead/
├── components/
│   ├── ConvertToCustomer.jsx    - Modal for converting lead to customer
│   ├── LeadCard.jsx              - Individual lead card component
│   ├── LeadDetailModal.jsx       - Modal showing full lead details
│   └── SearchBar.jsx             - Search and filter component
├── css/
│   └── leads.css                 - All styles for lead module
├── mock/
│   └── mockLeads.js              - Sample lead data
├── types/
│   └── lead.js                   - Lead type definitions and helpers
└── Leads.jsx                     - Main leads page component
```

## Integration with Your Project

### 1. Copy Files
Copy the entire `lead/` folder to your `src/pages/` directory.

### 2. Route Setup (Already Done)
Your `Artax.jsx` already has the route configured:
```jsx
<Route path="leads" element={<Leads />} />
```

### 3. SideMenu (Already Done)
Your `SideMenu.jsx` already includes the Leads menu item with proper role-based access.

## Usage

### Basic Usage
```jsx
import Leads from '../pages/lead/Leads';

// In your route
<Route path="leads" element={<Leads />} />
```

### Features
1. **Search & Filter**: Search by name/phone, filter by status
2. **Lead Cards**: Click to view details
3. **Detail Modal**: View complete lead information
4. **Convert to Customer**: Form with Amount, Opportunity, Currency fields

## Project Structure Analysis

### ✅ Strengths of Your Current Structure

1. **Clear Separation of Concerns**
   - `api/` - API calls isolated
   - `components/` - Reusable generic components
   - `pages/` - Feature-specific pages
   - `context/` - State management
   - `hooks/` - Custom hooks

2. **Consistent Page Structure**
   Each page module (customer, lead, etc.) follows the same pattern:
   ```
   PageName/
   ├── components/  - Page-specific components
   ├── css/         - Page-specific styles
   ├── hooks/       - Page-specific hooks
   ├── utils/       - Helper functions
   ├── js/          - Services and business logic
   └── PageName.jsx - Main page component
   ```

3. **Good Use of Context**
   - AuthContext for authentication
   - TabContext for tab management

4. **Protected Routes**
   - Proper authentication guards
   - Role-based access control

### 📋 Recommendations for Improvement

1. **Consider Adding These Folders (Optional)**
   ```
   src/
   ├── constants/        - App-wide constants (API URLs, status codes, etc.)
   ├── utils/            - Global utility functions
   ├── services/         - API service layer (centralized)
   └── styles/           - Global styles and theme
   ```

2. **API Layer Enhancement**
   Consider creating a centralized API service:
   ```javascript
   // src/services/api.js
   import axios from 'axios';
   
   const api = axios.create({
     baseURL: process.env.REACT_APP_API_URL,
     headers: { 'Content-Type': 'application/json' }
   });
   
   export default api;
   ```

3. **Environment Configuration**
   Create `.env` files for different environments:
   ```
   .env.development
   .env.production
   .env.test
   ```

4. **Error Boundary**
   Add a global error boundary component:
   ```jsx
   // src/components/ErrorBoundary.jsx
   class ErrorBoundary extends React.Component {
     // Handle errors gracefully
   }
   ```

5. **Loading States**
   Your `LoadingModel.jsx` is good. Consider adding:
   - Skeleton loaders for better UX
   - Global loading state in context

### 🎯 Best Practices You're Already Following

1. ✅ Modular structure by feature
2. ✅ Consistent naming conventions
3. ✅ Separation of business logic (services) from UI
4. ✅ Custom hooks for reusable logic
5. ✅ CSS Modules for scoped styling
6. ✅ Context API for state management
7. ✅ Protected routes with role-based access

### 📊 Overall Assessment

**Your structure is SOLID and follows industry standards!**

**Score: 8.5/10**

**Pros:**
- Clean, organized, and scalable
- Easy to navigate and understand
- Good separation of concerns
- Consistent patterns across modules

**Minor Improvements:**
- Add global constants/config folder
- Centralize API calls more
- Add error boundaries
- Consider adding a services layer

## Next Steps for Lead Module

1. **Replace Mock Data**: Connect to your actual API
   ```javascript
   // In Leads.jsx
   import { fetchLeads } from './js/leadService';
   
   useEffect(() => {
     const loadLeads = async () => {
       const data = await fetchLeads();
       setLeads(data);
     };
     loadLeads();
   }, []);
   ```

2. **Add Lead Service**
   ```javascript
   // src/pages/lead/js/leadService.js
   import api from '../../../api/axios'; // or your API instance
   
   export const fetchLeads = async () => {
     const response = await api.get('/leads');
     return response.data;
   };
   
   export const convertLeadToCustomer = async (leadId, conversionData) => {
     const response = await api.post(`/leads/${leadId}/convert`, conversionData);
     return response.data;
   };
   ```

3. **Add Custom Hook** (Optional)
   ```javascript
   // src/pages/lead/hooks/useLeadHandler.js
   import { useState, useEffect } from 'react';
   import { fetchLeads, convertLeadToCustomer } from '../js/leadService';
   
   export const useLeadHandler = () => {
     const [leads, setLeads] = useState([]);
     const [loading, setLoading] = useState(false);
     
     // Add your logic here
     
     return { leads, loading, /* other functions */ };
   };
   ```

## Support

If you need help integrating this module or have questions about the structure, feel free to ask!




# Lead Management Module

## Structure Overview

```
lead/
├── components/
│   ├── ConvertToCustomer.jsx    - Modal for converting lead to customer
│   ├── CreateLeadModal.jsx       - Modal for creating new lead
│   ├── LeadCard.jsx              - Individual lead card component
│   ├── LeadDetailModal.jsx       - Modal showing full lead details
│   └── SearchBar.jsx             - Search and filter component
├── css/
│   └── leads.css                 - All styles for lead module
├── hooks/
│   └── useLeadHandler.js         - Custom hook for lead operations
├── mock/
│   └── mockLeads.js              - Sample lead data
├── types/
│   └── lead.js                   - Lead type definitions and helpers
└── Leads.jsx                     - Main leads page component
```

## API Layer

### Location: `/src/api/LeadApi.js`

**IMPORTANT**: Keep API files in the root `api/` folder, NOT inside page folders.

### Available API Functions:

```javascript
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  convertLeadToCustomer,
  searchLeads
} from '../../../api/LeadApi';
```

## Integration Steps

### 1. Update Leads.jsx to Use Real API

Replace the mock data import with real API calls:

```javascript
// In Leads.jsx
import { getAllLeads } from '../../../api/LeadApi';

// Inside component
useEffect(() => {
  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await getAllLeads(token);
      setLeads(response.data);
    } catch (error) {
      console.error('Error loading leads:', error);
      alert('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };
  
  if (token) {
    loadLeads();
  }
}, [token]);
```

### 2. Update refreshLeads Function

```javascript
const refreshLeads = async () => {
  try {
    const response = await getAllLeads(token);
    setLeads(response.data);
  } catch (error) {
    console.error('Error refreshing leads:', error);
  }
};
```

### 3. Features Implemented

✅ **Create New Lead**
- Button in header to open create modal
- Form validation for required fields
- Email format validation
- Integrated with `useLeadHandler` hook

✅ **Search & Filter**
- Search by name/phone in real-time
- Filter by status dropdown

✅ **View Lead Details**
- Click any lead card to view full details
- Shows all lead information

✅ **Convert to Customer**
- Form with Amount, Opportunity, Currency fields
- Integrated with API handler
- Success notification

✅ **API Integration Ready**
- All CRUD operations supported
- Token-based authentication
- Error handling

## Custom Hook: useLeadHandler

Located in `/src/pages/lead/hooks/useLeadHandler.js`

### Usage:

```javascript
const {
  handleCreateLead,
  handleUpdateLead,
  handleDeleteLead,
  handleConvertLead,
  handleInputChange,
  handleCancel
} = useLeadHandler({
  token,
  setLoading,
  refreshLeads,
  setShowCreateModal,
  setShowDetailModal,
  setShowConvertModal
});
```

### Available Handlers:

1. **handleCreateLead(formData)** - Create a new lead
2. **handleUpdateLead(leadId, formData)** - Update existing lead
3. **handleDeleteLead(leadId)** - Delete a lead
4. **handleConvertLead(leadId, conversionData)** - Convert lead to customer
5. **handleInputChange(formData, setFormData)** - Handle form input changes
6. **handleCancel(setShowModal)** - Handle form cancellation

## API Structure Recommendation

### ✅ CORRECT Structure (Your Current Setup):

```
src/
├── api/
│   ├── apiClient.js
│   ├── CustomerApi.js
│   ├── LeadApi.js          ← New file added here
│   ├── ProjectApi.js
│   ├── OpportunitiesApi.js
│   └── ticketsApi.js
├── pages/
│   ├── customer/
│   │   ├── hooks/
│   │   │   └── useCustomerHandler.js
│   │   └── ...
│   └── lead/
│       ├── hooks/
│       │   └── useLeadHandler.js
│       └── ...
```

### ❌ INCORRECT Structure (Don't Do This):

```
src/
├── pages/
│   ├── customer/
│   │   ├── api/              ← Don't put API files here
│   │   │   └── CustomerApi.js
│   └── lead/
│       ├── api/              ← Don't put API files here
│       │   └── LeadApi.js
```

### Why Keep API Files at Root Level?

1. **Reusability**: API functions can be shared across multiple pages
2. **Separation of Concerns**: Clear distinction between UI (pages) and data layer (api)
3. **Maintainability**: Easier to find and update API endpoints
4. **Consistency**: Follows industry best practices
5. **Testing**: Easier to mock and test API calls

## Project Structure Analysis

### Your Structure Score: **9/10** 🎉

### Strengths:

✅ **Excellent Organization**
- Feature-based page structure
- Consistent patterns across modules
- Clear separation of concerns

✅ **API Layer**
- Centralized at root level
- Consistent naming conventions
- Token-based authentication

✅ **Custom Hooks**
- Reusable business logic
- Clean separation from UI
- Easy to test

✅ **Component Structure**
- Modular and reusable
- Props-based communication
- Single responsibility

✅ **Styling**
- CSS modules for scoping
- Consistent naming
- Responsive design

### Minor Suggestions:

1. **Add Constants Folder** (Optional)
   ```
   src/constants/
   ├── apiEndpoints.js
   ├── statusCodes.js
   └── appConfig.js
   ```

2. **Add Global Utils** (Optional)
   ```
   src/utils/
   ├── formatters.js
   ├── validators.js
   └── helpers.js
   ```

3. **Error Boundary** (Recommended)
   ```javascript
   // src/components/ErrorBoundary.jsx
   class ErrorBoundary extends React.Component {
     // Global error handling
   }
   ```

## Next Steps

### Immediate:
1. ✅ Create button and modal added
2. ✅ LeadApi.js created in `/src/api/`
3. ✅ useLeadHandler.js created
4. ⏳ Connect to your backend API (replace mock data)

### Future Enhancements:
1. **Edit Lead Functionality** - Add edit button in detail modal
2. **Bulk Operations** - Select multiple leads for batch actions
3. **Lead Assignment** - Assign leads to sales representatives
4. **Activity Timeline** - Track interactions with leads
5. **Lead Scoring** - Implement lead scoring system
6. **Export Functionality** - Export leads to CSV/Excel

## Testing Checklist

- [ ] Create new lead with valid data
- [ ] Create new lead with invalid data (test validation)
- [ ] Search leads by name
- [ ] Search leads by phone
- [ ] Filter leads by status
- [ ] View lead details
- [ ] Convert lead to customer
- [ ] Verify API calls with network tab
- [ ] Test responsive design on mobile
- [ ] Test loading states

## Support

If you need help with:
- API integration
- Adding new features
- Debugging issues
- Best practices

Feel free to ask! Your project structure is solid and follows industry standards.