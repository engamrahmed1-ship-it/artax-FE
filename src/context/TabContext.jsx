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
    if (!token) {
      console.warn("Attempted to open tab without auth token");
      return;
    }
    const tabId = `customer-${lightCustomer.customerId}`;

    console.log("this is our Customer")

    console.log(lightCustomer)
    // 1. If tab already exists, just switch to it
    if (tabs.some(t => t.id === tabId)) {
      setActiveTabId(tabId);
      navigate(`/customer/info/${lightCustomer.customerId}`);
      return;
    }

    try {
      // 2. Fetch the profile (which includes the interaction history)
      const response = await getCustomerProfile(lightCustomer.customerId, token);

      // Based on your JSON: response.data contains the totalCount, data array, etc.
      const fullProfileData = response.data;
      const interactions = Array.isArray(fullProfileData.interactions)
        ? fullProfileData.interactions
        : (fullProfileData.interactions?.data || []);

      const projects = Array.isArray(fullProfileData.projects)
        ? fullProfileData.projects
        : (fullProfileData.projects?.data || []);

      const opportunities = Array.isArray(fullProfileData.opportunities)
        ? fullProfileData.opportunities
        : (fullProfileData.opportunities?.data || []);

      const tickets = Array.isArray(fullProfileData.tickets)
        ? fullProfileData.tickets
        : (fullProfileData.tickets?.data || []);


      console.log("this is our Full Customer")

      console.log(response.data)

      // 3. Merge the light data with the new detailed data
      const updatedCustomer = {
        ...lightCustomer,
       interactions, // Store the interaction history
        projects,// MAP PROJECTS HERE
        opportunities,
        tickets,
        metadata: {
          totalInteractions: fullProfileData.totalCount ?? interactions.length,
          totalProjects: fullProfileData.projects?.totalCount ?? projects.length,
          totalOpportunities: fullProfileData.opportunities?.totalCount ?? opportunities.length,
          totalTickets: fullProfileData.tickets?.totalCount ?? tickets.length,
          lastUpdated: new Date().toISOString()
        }
      };



      setTabs(prev => [
        ...prev,
        {
          id: tabId,
          customerId: lightCustomer.customerId,
          type: lightCustomer.custType,
          title: lightCustomer.custType === "B2B"
            ? lightCustomer.b2b?.companyName ?? "Company"
            : `${lightCustomer.b2c?.firstName ?? ""} ${lightCustomer.b2c?.lastName ?? ""}`,
          customer: updatedCustomer
        }
      ]);

      setActiveTabId(tabId);

      window.requestAnimationFrame(() => {
        navigate(`/customer/info/${lightCustomer.customerId}`);
      });

    } catch (error) {
      console.error("Failed to fetch customer profile history:", error);
      // Fallback: Open tab with light data if API fails
      // or show an error notification
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
