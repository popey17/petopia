import React from 'react';
import { motion } from 'framer-motion';
import styles from '../../assets/scss/pages/App.module.scss';

const Dashboard: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default Dashboard;
