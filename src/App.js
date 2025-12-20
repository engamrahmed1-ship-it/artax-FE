import './App.css';
import Artax from './main/Artax';

function App() {
  return (
    <div className="App">
      <Artax/>
    </div>
    //   <div className="App">
    //     <Routes>
    //       {/* Public Route */}
    //       <Route path="/login" element={<LoginPage />} />

    //       {/* Protected Routes within the main layout */}
    //       <Route
    //         path="/"
    //         element={
    //           <ProtectedRoute>
    //             <Layout />
    //           </ProtectedRoute>
    //         }
    //       >
    //         <Route index element={<DashboardPage />} />
    //         <Route path="profile" element={<ProfilePage />} />
    //         <Route
    //           path="admin"
    //           element={
    //             <ProtectedRoute allowedRoles={['admin']}>
    //               <AdminPage />
    //             </ProtectedRoute>
    //           }
    //         />
    //       </Route>

    //       {/* Fallback for unmatched routes */}
    //       <Route path="*" element={<div>404 Not Found</div>} />
    //     </Routes>
    //   </div>
  );
}

export default App;
