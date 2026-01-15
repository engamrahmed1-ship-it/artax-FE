// TabContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCustomerProfile } from "../api/CustomerApi";
import { useAuth } from "../hooks/useAuth";

const TabContext = createContext(null);



export const useTabContext = () => {
  const ctx = useContext(TabContext);
  if (!ctx) {
    throw new Error("useTabContext must be used within TabProvider");
  }
  return ctx;
};

export const TabProvider = ({ children }) => {
  const [tabs, setTabs] = useState(() => {
    const savedTabs = localStorage.getItem("crm_tabs");
    return savedTabs ? JSON.parse(savedTabs) : [];
  });
  const [activeTabId, setActiveTabId] = useState(() => {
    return localStorage.getItem("crm_activeTabId") || null;
  });

  const navigate = useNavigate();
  const { token } = useAuth();


  // Add this inside TabProvider
  const { pathname } = useLocation(); // You'll need to import useLocation from react-router-dom

  useEffect(() => {
    const match = pathname.match(/\/customer\/info\/(\d+)/);
    if (match) {
      const idFromUrl = `customer-${match[1]}`;
      if (activeTabId !== idFromUrl) {
        setActiveTabId(idFromUrl);
      }
    }
  }, [pathname, activeTabId]);



  // 2. Handle Initial Navigation ONLY after Auth is ready
  useEffect(() => {
    // Only attempt to restore tabs if we have a valid token
    if (token && tabs.length > 0) {
      const savedActiveId = localStorage.getItem("crm_activeTabId");
      const activeTab = tabs.find(t => t.id === savedActiveId);

      // Only auto-redirect if the user is currently at the base login or home path
      const isAtBase = window.location.pathname === '/' || window.location.pathname === '/login';

      if (activeTab && isAtBase) {
        navigate(`/customer/info/${activeTab.customerId}`, { replace: true });
      }
    }
  }, [token]); // Dependency on token is key to prevent 401s




  // 3. Persist changes (Keep these, but make them Auth-Aware)
  useEffect(() => {
    // Only save if there is a token; otherwise, we want localStorage cleared
    if (token) {
      localStorage.setItem("crm_tabs", JSON.stringify(tabs));
    }
  }, [tabs, token]);

  useEffect(() => {
    if (activeTabId && token) {
      localStorage.setItem("crm_activeTabId", activeTabId);
    }
  }, [activeTabId, token]);

  useEffect(() => {
    if (!token) {
      setTabs([]);
      setActiveTabId(null);
      localStorage.removeItem("crm_tabs");
      localStorage.removeItem("crm_activeTabId");
    }
  }, [token]);


  // -------------------------
  // OPEN CUSTOMER TAB
  // -------------------------


  // TabContext.jsx

  const openTab = useCallback(async (lightCustomer) => {
    if (!token) return;
    
    const tabId = `customer-${lightCustomer.customerId}`;

    // 1. Quick Switch if already exists
    if (tabs.some(t => t.id === tabId)) {
        setActiveTabId(tabId);
        navigate(`/customer/info/${lightCustomer.customerId}`);
        return;
    }

    try {
        const response = await getCustomerProfile(token, lightCustomer.customerId);
        const fullProfileData = response.data;

        console.log("Fetched full profile data:", fullProfileData);
        // Enhancement: Unified Data Extraction Helper
        const unwrap = (field) => (Array.isArray(field) ? field : (field?.data || []));

        const interactions = unwrap(fullProfileData.interactions);
        const projects = unwrap(fullProfileData.projects);
        const opportunities = unwrap(fullProfileData.opportunities);
        const tickets = unwrap(fullProfileData.tickets);
        const documents = unwrap(fullProfileData.documents);
        const notes = unwrap(fullProfileData.notes);

        // Enhancement: Construct a clean customer object
        const updatedCustomer = {
            ...lightCustomer,
            ...fullProfileData.customer?.data?.[0], // Ensure base info is updated
            interactions,
            projects,
            opportunities,
            tickets,
            documents, // Added this line,
            notes,
            metadata: {
                totalInteractions: fullProfileData.interactions?.totalCount ?? interactions.length,
                totalProjects: fullProfileData.projects?.totalCount ?? projects.length,
                totalOpportunities: fullProfileData.opportunities?.totalCount ?? opportunities.length,
                totalTickets: fullProfileData.tickets?.totalCount ?? tickets.length,
                totalDocuments: fullProfileData.documents?.totalCount ?? documents.length, // Added this line
                 totalNotes: fullProfileData.notes?.totalCount ?? notes.length, // Added this line
                lastUpdated: new Date().toISOString()
            }
        };

        // Enhancement: Batch state updates
        setTabs(prev => [...prev, {
            id: tabId,
            customerId: lightCustomer.customerId,
            type: lightCustomer.custType,
            title: lightCustomer.custType === "B2B" 
                ? (lightCustomer.b2b?.companyName || "Company")
                : `${lightCustomer.b2c?.firstName || ""} ${lightCustomer.b2c?.lastName || ""}`.trim(),
            customer: updatedCustomer
        }]);

        setActiveTabId(tabId);
        navigate(`/customer/info/${lightCustomer.customerId}`);

    } catch (error) {
        console.error("Failed to fetch customer profile:", error);
        // UX Enhancement: Open with light data so the user isn't stuck
        setTabs(prev => [...prev, { id: tabId, customerId: lightCustomer.customerId, customer: lightCustomer }]);
        setActiveTabId(tabId);
        navigate(`/customer/info/${lightCustomer.customerId}`);
    }
}, [tabs, token, navigate]);

  // -------------------------
  // SWITCH TAB
  // -------------------------
  // TabContext.jsx

  const switchTab = useCallback((tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;

    // 1. Update the state so the UI highlights the correct tab
    setActiveTabId(tabId);

    // 2. Persist the active tab ID immediately to localStorage
    localStorage.setItem("crm_activeTabId", tabId);

    // 3. Move the user to that URL
    navigate(`/customer/info/${tab.customerId}`);
  }, [tabs, navigate]);

  // -------------------------
  // CLOSE TAB
  // -------------------------
  const closeTab = useCallback((tabId) => {
    // 1. Calculate the new state FIRST
    let fallbackId = null;
    let fallbackUrl = "/customer/search";

    setTabs(prev => {
      const remaining = prev.filter(t => t.id !== tabId);

      // 2. Logic to determine where to go if we closed the active tab
      if (tabId === activeTabId) {
        const fallback = remaining.at(-1);
        fallbackId = fallback?.id ?? null;
        fallbackUrl = fallback ? `/customer/info/${fallback.customerId}` : "/customer/search";
      }

      return remaining;
    });

    // 3. Update active ID and Navigate OUTSIDE of the setTabs call
    if (tabId === activeTabId) {
      setActiveTabId(fallbackId);
      navigate(fallbackUrl);
    }
  }, [activeTabId, navigate]);




  const getActiveTab = useCallback(
    () => tabs.find(t => t.id === activeTabId),
    [tabs, activeTabId]
  );


  const updateTabCustomer = useCallback((customerId, updatedCustomer) => {
    setTabs(prev => prev.map(tab =>
      tab.customerId === customerId
        ? { ...tab, customer: updatedCustomer }
        : tab
    ));
  }, []);


  return (
    <TabContext.Provider
      value={{
        tabs,           // Shared state
        activeTabId,    // Shared state
        openTab,
        closeTab,
        switchTab,      // Added this
        getActiveTab,
        updateTabCustomer
      }}
    >
      {children}
    </TabContext.Provider>
  );
};
