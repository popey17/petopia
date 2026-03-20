import React, { useEffect, useState } from 'react';
import { X, Heart, MessageCircle, MoreVertical, Pencil, Trash } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { usePostStore } from '../../stores/usePostStore';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import styles from './PostDetail.module.scss';
import EditPostModal from './EditPostModal';
import DeleteConfirmModal from './DeleteConfirmModal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PostDetailProps {
  postId: string;
  onClose: () => void;
}

interface DetailedPost {
  id: string;
  caption: string | null;
  images: { url: string }[];
  createdAt: string;
  pet: {
    name: string;
    displayName: string;
    avatar: string | null;
    ownerId: string;
  };
  _count: {
    likes: number;
  };
  isLiked: boolean;
}

const PostDetail: React.FC<PostDetailProps> = ({ postId, onClose }) => {
  const [post, setPost] = useState<DetailedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuthStore();
  const { deletePost, isSubmitting, likePost, unlikePost } = usePostStore();

  const handleLike = async () => {
    if (!post) return;
    try {
      if (post.isLiked) {
        await unlikePost(post.id);
        setPost({
          ...post,
          isLiked: false,
          _count: { likes: post._count.likes - 1 }
        });
      } else {
        await likePost(post.id);
        setPost({
          ...post,
          isLiked: true,
          _count: { likes: post._count.likes + 1 }
        });
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchPostDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`);
        if (!res.ok) throw new Error('Post not found');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await deletePost(postId);
      onClose();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleUpdateSuccess = (updatedPost: DetailedPost) => {
    setPost(updatedPost);
    setShowEditModal(false);
  };

  if (error || (!loading && !post)) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.error}>{error || 'Post not found'}</div>
        </div>
      </div>
    );
  }

  // We hide everything until the image is loaded to provide a seamless appearance
  const isVisible = post && imageLoaded && !loading;
  const isOwner = user && post && user.id === post.pet.ownerId;

  return (
    <div className={`${styles.overlay} ${!isVisible ? styles.transparentOverlay : ''}`} onClick={onClose}>
      <button className={styles.closeBtn} onClick={onClose}>
        <X size={32} />
      </button>
      
      {post && (
        <div 
          className={`${styles.modal} ${!isVisible ? styles.hidden : ''}`} 
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.imageSection}>
            {post.images.length > 1 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className={styles.swiper}
              >
                {post.images.map((img, index) => (
                  <SwiperSlide key={index} className={styles.slide}>
                    <img 
                      src={img.url} 
                      alt={`${post.caption || 'Pet post'} - ${index + 1}`} 
                      onLoad={index === 0 ? () => setImageLoaded(true) : undefined}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <img 
                src={post.images[0]?.url} 
                alt={post.caption || 'Pet post'} 
                onLoad={() => setImageLoaded(true)}
              />
            )}
          </div>
          
          <div className={styles.contentSection}>
            <div className={styles.header}>
              <div className={styles.petInfo}>
                <img 
                  src={post.pet.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + post.pet.name} 
                  alt={post.pet.displayName} 
                />
                <div className={styles.petNames}>
                  <h3>{post.pet.displayName}</h3>
                  <span>@{post.pet.name}</span>
                </div>
              </div>

              {isOwner && (
                <div className={styles.optionsWrapper}>
                  <button className={styles.optionsBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <MoreVertical size={20} />
                  </button>
                  {isMenuOpen && (
                    <div className={styles.dropdown}>
                      <button onClick={() => { setShowEditModal(true); setIsMenuOpen(false); }}><Pencil size={16} /> Edit</button>
                      <button onClick={() => { setShowDeleteConfirm(true); setIsMenuOpen(false); }} className={styles.danger}><Trash size={16} /> Delete</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.body}>
              <div className={styles.captionSection}>
                <img 
                  src={post.pet.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + post.pet.name} 
                  className={styles.smallAvatar}
                  alt={post.pet.displayName} 
                />
                <div className={styles.captionText}>
                  <p><strong>{post.pet.name}</strong> {post.caption}</p>
                  <span className={styles.postDate}>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className={styles.commentsList}>
                {/* Real comments would be mapped here */}
                <div className={styles.commentItem}>
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy" className={styles.smallAvatar} alt="Buddy" />
                  <div className={styles.captionText}>
                    <p><strong>buddy_woofer</strong> Looking great! 😍</p>
                    <span className={styles.postDate}>1h</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <div className={styles.actions}>
                <button 
                  onClick={handleLike}
                  className={post.isLiked ? styles.liked : ''}
                >
                  <Heart size={24} />
                </button>
                <button><MessageCircle size={24} /></button>
              </div>
              <div className={styles.likeStats}>
                <strong>{post._count.likes} {post._count.likes === 1 ? 'like' : 'likes'}</strong>
              </div>
              <div className={styles.addComment}>
                <input type="text" placeholder="Add a comment..." className={styles.commentInput} />
                <button className={styles.postBtn}>Post</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal 
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isLoading={isSubmitting}
        />
      )}

      {showEditModal && post && (
        <EditPostModal 
          post={post}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default PostDetail;
