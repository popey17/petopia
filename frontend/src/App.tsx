import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar/Sidebar';
import styles from './assets/scss/pages/App.module.scss';

import { useUIStore } from './stores/useUIStore';
import { useAuthStore } from './stores/useAuthStore';

function App() {
  const { sidebarCollapsed } = useUIStore();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#ff85a1' }}>Loading Petopia...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`${styles.App} ${sidebarCollapsed ? styles.collapsed : ''}`}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
