import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../../assets/scss/pages/App.module.scss';
import PostCard from '../../components/PostCard/PostCard';
import { usePostStore } from '../../stores/usePostStore';

interface Post {
  id: string;
  caption: string | null;
  images: { url: string }[];
  createdAt: string;
  pet: {
    name: string;
    displayName: string;
    avatar: string | null;
  };
  _count: {
    likes: number;
  };
  isLiked: boolean;
}

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { version } = usePostStore();

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/feed`);
        if (!res.ok) throw new Error('Failed to fetch feed');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [version]);

  return (
    <>
      <header className={styles.header}>
        <h2 className={styles.greeting}>Good morning, Pet Lover! 🐾</h2>
      </header>
      
      <section className={styles.content}>
        {posts.length === 0 && !loading && (
          <motion.div 
            className={styles.welcome}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Ready to explore Petopia?</h3>
            <p>Follow some furry friends to see their latest moments here! 🐶🐱</p>
          </motion.div>
        )}
        
        <div className={styles.feed}>
          {loading ? (
            <div className={styles['placeholder-grid']}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.card} />
              ))}
            </div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
