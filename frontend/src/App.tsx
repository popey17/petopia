import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar/Sidebar';
import styles from './assets/scss/pages/App.module.scss';
import { motion } from 'framer-motion';

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
        <header className={styles.header}>
          <h2 className={styles.greeting}>Good morning, Pet Lover! 🐾</h2>
        </header>
        
        <section className={styles.content}>
          <motion.div 
            className={styles.welcome}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Ready to explore Petopia?</h3>
            <p>Start by sharing a moment with your furry friend or browse what's new in the community.</p>
          </motion.div>
          
          <div className={styles['placeholder-grid']}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.card} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
