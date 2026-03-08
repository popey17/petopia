import React, { useEffect, useState } from 'react';
import { X, Heart, MessageCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import styles from './PostDetail.module.scss';

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
  };
}

const PostDetail: React.FC<PostDetailProps> = ({ postId, onClose }) => {
  const [post, setPost] = useState<DetailedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
                <button><Heart size={24} /></button>
                <button><MessageCircle size={24} /></button>
              </div>
              <div className={styles.likeStats}>
                <strong>0 likes</strong>
              </div>
              <div className={styles.addComment}>
                <input type="text" placeholder="Add a comment..." className={styles.commentInput} />
                <button className={styles.postBtn}>Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
