import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, Search, User, Settings, Dog, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../../stores/useUIStore';
import { useAuthStore } from '../../../stores/useAuthStore';
import styles from '../../../assets/scss/components/Sidebar.module.scss';

const Sidebar: React.FC = () => {
  const { sidebarCollapsed: isCollapsed, toggleSidebar } = useUIStore();
  const user = useAuthStore((state) => state.user);
  const defaultPet = user?.defaultPet;

  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/' },
    { icon: <MessageCircle size={24} />, label: 'Messages', path: '/messages' },
    { icon: <Search size={24} />, label: 'Search', path: '/search' },
    { icon: <User size={24} />, label: 'Profile', path: '/profile' },
    { icon: <Settings size={24} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={`${styles.Sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <button 
        className={styles['collapse-toggle']} 
        onClick={toggleSidebar}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <div className={styles['toggle-inner']}>
          {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
        </div>
      </button>

      <div className={styles['logo-section']}>
        <motion.div 
          className={styles.logo}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <Dog size={32} />
        </motion.div>
        {!isCollapsed && (
          <motion.span 
            className={styles['logo-text']}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Petopia
          </motion.span>
        )}
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink 
            key={item.label} 
            to={item.path} 
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }: { isActive: boolean }) => `${styles['nav-item']} ${isActive ? styles.active : ''} ${isCollapsed ? styles.minimized : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {!isCollapsed && (
              <motion.span 
                className={styles.label}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
        {defaultPet && (
          <NavLink 
            to="/profile"
            title={isCollapsed ? defaultPet.name : undefined}
            className={({ isActive }: { isActive: boolean }) => `${styles['nav-item']} ${styles['profile-nav-item']} ${isActive ? styles.active : ''} ${isCollapsed ? styles.minimized : ''}`}
          >
            <span className={styles.icon}>
              <div className={styles['pet-avatar']}>
                <img src={defaultPet.image} alt={defaultPet.name} />
              </div>
            </span>
            {!isCollapsed && (
              <motion.span 
                className={styles.label}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Profile
              </motion.span>
            )}
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
