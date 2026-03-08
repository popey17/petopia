import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

const RootLayout = () => {
  const { isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        background: '#fff9fa',
        color: '#ff85a1',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid #fdf2f4', 
          borderTop: '3px solid #ff85a1', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Loading Petopia...</span>
      </div>
    );
  }

  return <Outlet />;
};

export default RootLayout;
