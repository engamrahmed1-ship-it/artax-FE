# ARTAX Frontend - AI Coding Agent Instructions

## Project Overview

**ARTAX Frontend** is a React 19 + React Router v7 enterprise dashboard application with JWT-based authentication and role-based access control (RBAC). The app communicates with a backend API running on `http://localhost:8080`.

**Key Stack:** React 19, React Router DOM 7.9.6, Axios (HTTP client), JWT tokens (via `jwt-decode`), React Testing Library

---

## Architecture Patterns

### 1. Authentication & Authorization Flow

**Entry Point:** `src/index.js` → `App.js`

The authentication model uses a custom **Context + Hooks pattern**:

- **`AuthContext.jsx`** (Context Provider): Manages user state and JWT token lifecycle
  - Stores token in `localStorage` under key `authToken`
  - Decodes JWT to extract user info and roles (expects `realm_access.roles` from backend)
  - Auto-injects `Authorization: Bearer {token}` header into all API calls via `apiClient`
  - `login(username, password)` calls `/api/authenticate` endpoint

- **`useAuth.js` (Custom Hook)**: Must be used within `AuthProvider` to access `{ user, token, login, logout }`

- **`ProtectedRoute.jsx`**: Higher-order component wrapper that:
  - Redirects unauthenticated users to `/login` (preserves redirect-after-login with `location.state`)
  - Enforces role-based access via `allowedRoles` prop (role checking: `user.roles.some(role => allowedRoles.includes(role))`)

**Critical:** The main layout route is protected, but nested routes like `/admin` can have additional RBAC constraints.

### 2. Routing Structure

**Router Hierarchy (App.js):**
```
/login                          → LoginPage (public)
/                               → ProtectedRoute(Layout)
  ├─ / (index)                  → DashboardPage
  ├─ /profile                   → ProfilePage
  └─ /admin                     → ProtectedRoute(AdminPage, roles=['admin'])
*                               → 404 Not Found
```

**Pattern:** Nested `<Outlet />` used in `Layout.jsx` to render child routes. Page components are pure presentational components (e.g., `DashboardPage.jsx`, `AdminPage.jsx`).

### 3. Layout & Component Structure

- **`Layout.jsx`**: Main layout wrapper (flexbox: side menu + main content area)
- **`SideMenu.jsx`**: Dynamic navigation sidebar that:
  - Filters menu items based on user roles from `AuthContext`
  - Uses `NavLink` with active state styling (CSS Module: `SideMenu.module.css`)
  - Includes logout button that clears token and redirects to login

**Convention:** Each page module has its own CSS file (e.g., `pages/home/css/loign.css` for LoginPage)

### 4. API Communication

**`apiClient.js`** (Singleton Axios Instance):
- Base URL: `http://localhost:8080`
- Default header: `Content-Type: application/json`
- Authorization header injected by `AuthContext` after login

**Expected Backend Endpoints:**
- `POST /api/authenticate` → `{ token: "jwt_string" }`
- All subsequent requests include `Authorization` header automatically

**Import pattern:** `import { apiClient } from '../api/apiClient'` then use `apiClient.post/get/etc()`

---

## Developer Workflows

### Build & Development
- **Start dev server:** `npm start` (http://localhost:3000)
- **Production build:** `npm run build` → outputs to `build/` folder
- **Run tests:** `npm test` (watch mode with React Testing Library)
- **Lint:** Included via `react-scripts` (ESLint config extends `react-app`)

### Testing Patterns
- Test files: `*.test.js` colocated with source files
- Setup: `setupTests.js` configures React Testing Library
- DOM utilities available via `@testing-library/dom` and `@testing-library/react`

---

## Project-Specific Conventions

1. **File Extensions:** `.jsx` for React components, `.js` for utilities/hooks/context
2. **CSS Organization:** CSS Modules preferred for scoped styles (e.g., `SideMenu.module.css`); inline styles used in simple cases (e.g., LoginPage)
3. **Page Folder Structure:** Each page lives in `src/pages/{domain}/{PageName}.jsx` with optional `css/` subfolder (e.g., `admin/AdminPage.jsx`, `dashboard/DashboardPage.jsx`)
4. **Hooks Location:** Custom hooks in `src/hooks/` (e.g., `useAuth.js`)
5. **Context Location:** Global state contexts in `src/context/` (e.g., `AuthContext.jsx`)
6. **Protected Routes:** Role-based constraints applied at the route level in `App.js`, not page-level logic

---

## Cross-Component Communication

- **Auth State:** Passed via `AuthContext` → consumed by `useAuth()` hook throughout the app
- **Route State:** Preserving user's intended destination on redirect: `useLocation()` captures `state.from.pathname`
- **API Calls:** All HTTP requests use the centralized `apiClient` singleton for consistent header injection

---

## Key Integration Points

1. **Backend API:** Must implement `/api/authenticate` endpoint returning JWT with `realm_access.roles` claim
2. **JWT Token:** Expected to contain `name`, `email`, and `realm_access.roles` fields
3. **Deployed Pages:** Stub files exist for `product/`, `inventory/`, `order/`, `crm/` folders—these are placeholders for future feature areas

---

## Critical Files for Understanding the System

- **Route Configuration:** `src/App.js` (see how ProtectedRoute wraps Layout and nested admin route)
- **Auth Logic:** `src/context/AuthContext.jsx` (token lifecycle, login/logout)
- **API Setup:** `src/api/apiClient.js` (single HTTP client configuration)
- **Layout Template:** `src/components/layouts/Layout.jsx` + `SideMenu.jsx` (main UI shell)

---

## Common Development Tasks

**Adding a new protected page:**
1. Create `src/pages/{domain}/{PageName}.jsx`
2. Import in `App.js` and add route inside the main `ProtectedRoute`
3. For role-restricted pages, wrap with `<ProtectedRoute allowedRoles={['admin']}>` 
4. Add menu item to `menuItems` array in `SideMenu.jsx` with appropriate `allowedRoles`

**Calling backend API:**
```javascript
import { apiClient } from '../api/apiClient';

const response = await apiClient.post('/api/endpoint', { data });
// Token automatically included in Authorization header
```

**Accessing current user info in a component:**
```javascript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { user, logout } = useAuth();
  return <div>{user?.name}</div>;
};
```
