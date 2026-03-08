import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar/Sidebar';
import styles from './assets/scss/pages/App.module.scss';

import { useUIStore } from './stores/useUIStore';
import { useAuthStore } from './stores/useAuthStore';

function App() {
  const { sidebarCollapsed } = useUIStore();
  const { isAuthenticated } = useAuthStore();

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
