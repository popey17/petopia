import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Search, User, Settings, Dog, ChevronLeft, ChevronRight, LogOut, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../../stores/useUIStore';
import { useAuthStore } from '../../../stores/useAuthStore';
import styles from '../../../assets/scss/components/Sidebar.module.scss';

const Sidebar: React.FC = () => {
  const { sidebarCollapsed: isCollapsed, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const defaultPet = user?.defaultPet;
  const navigate = useNavigate();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/' },
    { icon: <MessageCircle size={24} />, label: 'Messages', path: '/messages' },
    { icon: <Search size={24} />, label: 'Search', path: '/search' },
    { icon: <User size={24} />, label: 'Profile', path: defaultPet ? `/${defaultPet.name}` : '/profile' },
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
        {(!isCollapsed || isMobile) && (
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
        {user && (
          <div className={styles['profile-menu-container']} ref={menuRef}>
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              title={isCollapsed ? (defaultPet?.name || user.name) : undefined}
              className={`${styles['nav-item']} ${styles['profile-nav-item']} ${isProfileMenuOpen ? styles.active : ''} ${isCollapsed ? styles.minimized : ''}`}
            >
              <span className={styles.icon}>
                <div className={styles['pet-avatar']}>
                  <img src={defaultPet?.avatar || user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky'} alt="Profile" />
                </div>
              </span>
              {!isCollapsed && (
                <motion.span 
                  className={styles.label}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {defaultPet?.displayName || user.name}
                </motion.span>
              )}
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div 
                  className={`${styles['profile-dropdown']} ${isCollapsed ? styles['collapsed-dropdown'] : ''}`}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles['dropdown-header']}>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <div className={styles['dropdown-items']}>
                    <button onClick={() => { setIsProfileMenuOpen(false); navigate(defaultPet ? `/${defaultPet.name}` : '/profile'); }}>
                      <User size={16} /> View Profile
                    </button>
                    <button onClick={() => { setIsProfileMenuOpen(false); /* Switch profile log here */ }}>
                      <Repeat size={16} /> Switch Profile
                    </button>
                    <div className={styles.divider} />
                    <button className={styles.danger} onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
