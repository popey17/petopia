import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Grid, Camera, Heart, MessageCircle } from 'lucide-react';
import styles from './Profile.module.scss';
import PostDetail from '../../components/PostDetail/PostDetail';

interface PetProfile {
  id: string;
  name: string;
  displayName: string;
  bio: string | null;
  avatar: string | null;
  species: string;
  breed: string;
  gender: string;
  birthDate: string | null;
  location: string | null;
  _count: {
    posts: number;
  };
}

interface Post {
  id: string;
  caption: string | null;
  images: { url: string }[];
  createdAt: string;
}

const Profile: React.FC = () => {
  const { petName } = useParams<{ petName: string }>();
  const [pet, setPet] = useState<PetProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!petName) return;
      setLoading(true);
      try {
        const petRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pets/${petName}`);
        if (!petRes.ok) throw new Error('Pet not found');
        const petData = await petRes.json();
        setPet(petData);

        const postsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/pet/${petData.id}`);
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [petName]);

  if (loading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (error || !pet) {
    return <div className={styles.error}>{error || 'Pet not found'}</div>;
  }

  return (
    <div className={styles.ProfilePage}>
      <header className={styles.header}>
        <div className={styles['avatar-container']}>
          <div className={styles.avatar}>
            <img 
              src={pet.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + pet.name} 
              alt={pet.displayName} 
            />
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles['name-row']}>
            <h1>{pet.displayName}</h1>
            <span className={styles.handle}>@{pet.name}</span>
            <div className={styles.actions}>
              <button className={styles['btn-follow']}>Follow</button>
              <button className={styles['btn-message']}>Message</button>
            </div>
          </div>

          <div className={styles.stats}>
            <span><strong>{pet._count.posts}</strong> posts</span>
            <span><strong>0</strong> followers</span>
            <span><strong>0</strong> following</span>
          </div>

          <div className={styles.bio}>
            <p className={styles['real-name']}>{pet.displayName}</p>
            <p>{pet.bio || `A cute ${pet.breed} ${pet.species}!`}</p>
            <div className={styles.meta}>
              {pet.location && (
                <span><MapPin size={14} /> {pet.location}</span>
              )}
              {pet.birthDate && (
                <span><Calendar size={14} /> Born {new Date(pet.birthDate).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className={styles.tabs}>
        <button className={styles.active}>
          <Grid size={18} /> POSTS
        </button>
      </div>

      <div className={styles['posts-grid']}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div 
              key={post.id} 
              className={styles['post-card']}
              onClick={() => setSelectedPostId(post.id)}
            >
              <img src={post.images[0]?.url} alt={post.caption || 'Pet post'} />
              <div className={styles.overlay}>
                <span><Heart size={20} fill="white" /> 0</span>
                <span><MessageCircle size={20} fill="white" /> 0</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles['no-posts']}>
            <div className={styles['empty-icon']}>
              <Camera size={48} />
            </div>
            <h3>No Posts Yet</h3>
            <p>When {pet.displayName} shares photos, they will appear here.</p>
          </div>
        )}
      </div>

      {selectedPostId && (
        <PostDetail 
          postId={selectedPostId} 
          onClose={() => setSelectedPostId(null)} 
        />
      )}
    </div>
  );
};

export default Profile;
