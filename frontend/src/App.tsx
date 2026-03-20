import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar/Sidebar';
import styles from './assets/scss/pages/App.module.scss';

import { useUIStore } from './stores/useUIStore';
import { useAuthStore } from './stores/useAuthStore';
import CreatePostButton from './components/PostCreation/CreatePostButton';
import CreatePostModal from './components/PostCreation/CreatePostModal';

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
      
      {/* Post Creation Feature */}
      <CreatePostButton />
      <CreatePostModal />
    </div>
  );
}

export default App;
