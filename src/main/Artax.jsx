import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/home/LoginPage";
import ProtectedRoute from "../components/protected/ProtectedRoute";
import Layout from "../components/layouts/Layout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import Profile from "../pages/profile/Profile";
import AdminPage from "../pages/admin/AdminPage";
import { AuthProvider } from "../context/AuthContext";
import Footer from "./Footer";
import PublicOnlyRoute from "../components/protected/PublcOnlyRoute";
import CrmPage from "../pages/crm/CrmPage";
import CustomerInfo from "../pages/crm/CustomerInfo";
import CreateCustomer from "../pages/crm/CreateCustomer";
import CustomerSearch from "../pages/crm/CustomerSearch";
import { TabProvider } from "../context/TabContext";
import Leads from "../pages/lead/Leads";

// ------------------------------
//  SHOW HEADER ONLY IF LOGGED IN
// ------------------------------
// function AuthenticatedHeader() {
//   const { user } = useAuth();
//   return user ? <Header /> : null;
// }


// ------------------------------
// MAIN APP ROUTER
// ------------------------------
export default function Artax() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* PUBLIC */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />

          {/* PRIVATE */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TabProvider>
                  <Layout />
                </TabProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<AdminPage />} />
             <Route path="leads" element={<Leads />} />

            {/* CRM */}
            <Route path="customer" element={<CrmPage />}>
              <Route index element={<Navigate to="search" replace />} />
              <Route path="search" element={<CustomerSearch />} />
              <Route path="info/:id" element={<CustomerInfo />} />
              <Route path="new" element={<CreateCustomer />} />
            </Route>

            <Route path="*" element={<div>404 – Not Found</div>} />
          </Route>
        </Routes>

        <Footer />
      </AuthProvider>
    </BrowserRouter>


  );
}
