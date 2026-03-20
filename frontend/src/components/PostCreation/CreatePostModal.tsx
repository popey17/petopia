import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, PawPrint, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePostStore } from '../../stores/usePostStore';
import { useAuthStore } from '../../stores/useAuthStore';
import styles from '../../assets/scss/components/CreatePostModal.module.scss';

const CreatePostModal: React.FC = () => {
  const { isModalOpen, closeModal, isSubmitting, error, createPost } = usePostStore();
  const { user } = useAuthStore();
  
  const [selectedPetId, setSelectedPetId] = useState<string>(user?.defaultPet?.id || user?.pets?.[0]?.id || '');
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 10 images as per backend
    const newImages = [...images, ...files].slice(0, 10);
    setImages(newImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews].slice(0, 10));
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId || images.length === 0) return;

    const formData = new FormData();
    formData.append('petId', selectedPetId);
    formData.append('caption', caption);
    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      for (const [key, value] of formData.entries()) {
  console.log(key, value);
}
      await createPost(formData);
      // Reset form on success
      setCaption('');
      setImages([]);
      setPreviews([]);
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={closeModal}>
        <motion.div 
          className={styles.modal} 
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className={styles.header}>
            <h2>Create New Post</h2>
            <button className={styles['close-btn']} onClick={closeModal}>
              <X size={24} />
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles['error-message']}>{error}</div>}

            <div className={styles.field}>
              <label><PawPrint size={18} /> Select your pet</label>
              <div className={styles['pet-selector']}>
                {user?.pets?.map(pet => (
                  <div 
                    key={pet.id} 
                    className={`${styles['pet-option']} ${selectedPetId === pet.id ? styles.selected : ''}`}
                    onClick={() => setSelectedPetId(pet.id)}
                  >
                    <img src={pet.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky'} alt={pet.displayName} />
                    <span>{pet.displayName}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label><ImageIcon size={18} /> Photos</label>
              {previews.length > 0 ? (
                <div className={styles['preview-grid']}>
                  {previews.map((url, index) => (
                    <div key={url} className={styles['preview-item']}>
                      <img src={url} alt="Preview" />
                      <button type="button" className={styles['remove-btn']} onClick={() => removeImage(index)}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {previews.length < 10 && (
                    <div className={styles['upload-area']} onClick={() => fileInputRef.current?.click()} style={{ padding: '20px' }}>
                      <Plus size={24} />
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles['upload-area']} onClick={() => fileInputRef.current?.click()}>
                  <div className={styles['icon-wrapper']}>
                    <ImageIcon size={28} />
                  </div>
                  <p>Click to upload photos</p>
                  <span>Up to 10 images</span>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                multiple 
                hidden 
              />
            </div>

            <div className={styles.field}>
              <label>Caption</label>
              <textarea 
                placeholder="What's your pet up to? #Petopia" 
                value={caption}
                onChange={e => setCaption(e.target.value)}
              />
            </div>
          </form>

          <div className={styles.footer}>
            <button type="button" className={styles['cancel-btn']} onClick={closeModal}>Cancel</button>
            <button 
              type="submit" 
              className={styles['submit-btn']} 
              disabled={isSubmitting || !selectedPetId || images.length === 0}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <><Loader2 size={20} className="animate-spin" /> Posting...</>
              ) : (
                <>Post <Send size={18} /></>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Plus: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default CreatePostModal;
