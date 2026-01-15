import React from 'react';
import ScreenNav from '../../components/layouts/ScreenNav';
import { Outlet } from 'react-router-dom';
import TabBar from '../../components/layouts/TabBar';
import { TabProvider } from '../../context/TabContext';

const CrmPage = () => {
  // const { user } = useAuth();
  const navItems = [
    { label: "Search", path: "/customer/search", disabled: false },
    // { label: "info", path: "/customer/info" , disabled: true},
    { label: "New", path: "/customer/new", disabled: false },
  ];

  return (
    <TabProvider> {/* Wrap the whole layout */}
      <div>
        <ScreenNav items={navItems} />
        <div>
          <TabBar />
          <Outlet /> {/* No need to pass context prop here */}
        </div>
      </div>
    </TabProvider>

  );
};

export default CrmPage;
