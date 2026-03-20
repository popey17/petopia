import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePostStore } from '../../stores/usePostStore';
import styles from '../../assets/scss/components/CreatePostButton.module.scss';

const CreatePostButton: React.FC = () => {
  const { openModal } = usePostStore();

  return (
    <motion.button
      className={styles.CreatePostButton}
      onClick={openModal}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Create new post"
    >
      <Plus size={24} strokeWidth={2.5} />
      <span className={styles.text}>Create Post</span>
    </motion.button>
  );
};

export default CreatePostButton;
