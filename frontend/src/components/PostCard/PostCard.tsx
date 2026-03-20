import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import styles from './PostCard.module.scss';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PostCardProps {
  post: {
    id: string;
    caption: string | null;
    images: { url: string }[];
    createdAt: string;
    pet: {
      name: string;
      displayName: string;
      avatar: string | null;
    };
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className={styles.postCard}>
      <header className={styles.header}>
        <Link to={`/${post.pet.name}`} className={styles.petInfo}>
          <img 
            src={post.pet.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + post.pet.name} 
            alt={post.pet.displayName} 
          />
          <span className={styles.displayName}>{post.pet.displayName}</span>
        </Link>
        <button className={styles.moreBtn}>
          <MoreHorizontal size={20} />
        </button>
      </header>

      <div className={styles.imageSection}>
        {post.images.length > 1 ? (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className={styles.swiper}
          >
            {post.images.map((img, index) => (
              <SwiperSlide key={index}>
                <img src={img.url} alt={`${post.caption || 'Pet post'} - ${index + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img src={post.images[0]?.url} alt={post.caption || 'Pet post'} />
        )}
      </div>

      <div className={styles.actions}>
        <div className={styles.leftActions}>
          <button><Heart size={24} /></button>
          <button><MessageCircle size={24} /></button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.likes}>0 likes</div>
        <div className={styles.caption}>
          <Link to={`/${post.pet.name}`} className={styles.petName}>
            {post.pet.name}
          </Link>{' '}
          {post.caption}
        </div>
        <div className={styles.date}>
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
