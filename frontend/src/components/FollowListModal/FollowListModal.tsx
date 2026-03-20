import React, { useEffect, useState } from 'react';
import { X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import styles from './FollowListModal.module.scss';

interface Pet {
  id: string;
  name: string;
  displayName: string;
  avatar: string | null;
  species: string;
  breed: string;
  isFollowing: boolean;
}

interface FollowListModalProps {
  petId: string;
  type: 'followers' | 'following';
  onClose: () => void;
}

const FollowListModal: React.FC<FollowListModalProps> = ({ petId, type, onClose }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followLoading, setFollowLoading] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pets/${petId}/${type}`);
        if (!response.ok) throw new Error(`Failed to fetch ${type}`);
        const data = await response.json();
        setPets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [petId, type]);

  const handleFollow = async (targetPet: Pet) => {
    if (!user?.defaultPet?.id || followLoading) return;
    
    // Don't allow pet to follow itself
    if (user.defaultPet.id === targetPet.id) return;

    setFollowLoading(targetPet.id);
    const method = targetPet.isFollowing ? 'DELETE' : 'POST';
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pets/${targetPet.id}/follow`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: user.defaultPet.id }),
      });

      if (res.ok) {
        setPets(prev => prev.map(p => 
          p.id === targetPet.id ? { ...p, isFollowing: !p.isFollowing } : p
        ));
      }
    } catch (err) {
      console.error('Follow error:', err);
    } finally {
      setFollowLoading(null);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : pets.length === 0 ? (
            <div className={styles.empty}>No {type} yet.</div>
          ) : (
            <ul className={styles.petList}>
              {pets.map((pet) => (
                <li key={pet.id} className={styles.petItem}>
                  <Link to={`/${pet.name}`} className={styles.petLink} onClick={onClose}>
                    <div className={styles.avatar}>
                      {pet.avatar ? (
                        <img src={pet.avatar} alt={pet.displayName} />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <div className={styles.petInfo}>
                      <span className={styles.displayName}>{pet.displayName}</span>
                      <span className={styles.name}>@{pet.name}</span>
                    </div>
                  </Link>
                  {user?.defaultPet?.id !== pet.id && (
                    <button 
                      className={`${styles.followBtn} ${pet.isFollowing ? styles.following : ''}`}
                      onClick={() => handleFollow(pet)}
                      disabled={followLoading === pet.id}
                    >
                      {followLoading === pet.id ? '...' : (pet.isFollowing ? 'Unfollow' : 'Follow')}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
