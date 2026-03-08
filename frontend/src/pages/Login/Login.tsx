import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { Dog, Mail, Lock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from '../../assets/scss/pages/Login.module.scss';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch {
      // Error is handled by the store and displayed in the UI
    }
  };

  return (
    <div className={styles.Login}>
      <motion.div
        className={styles['login-card']}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className={styles.header}>
          <div className={styles['icon-wrapper']}>
            <Dog size={40} className={styles.icon} />
          </div>
          <h1 className={styles.title}>Welcome back!</h1>
          <p className={styles.subtitle}>Log in to Petopia and see what's new</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles['error-message']} style={{ color: '#e74c3c', backgroundColor: '#fdf0ed', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div className={styles['input-group']}>
            <label htmlFor="email">Email address</label>
            <div className={styles['input-wrapper']}>
              <Mail size={18} className={styles['field-icon']} />
              <input
                type="email"
                id="email"
                placeholder="hello@petopia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles['input-group']}>
            <label htmlFor="password">Password</label>
            <div className={styles['input-wrapper']}>
              <Lock size={18} className={styles['field-icon']} />
              <input
                type="password"
                id="password"
                placeholder="Your secret password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles['submit-btn']} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
            {!isLoading && <Heart size={18} fill="currentColor" />}
          </button>
        </form>

        <footer className={styles.footer}>
          <p>Don't have an account? <a href="/signup">Join Petopia</a></p>
        </footer>
      </motion.div>

      <div className={styles.background}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
      </div>
    </div>
  );
};

export default Login;
