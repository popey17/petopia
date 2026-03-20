import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Send, Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePostStore } from '../../stores/usePostStore';
import styles from '../../assets/scss/components/CreatePostModal.module.scss';

interface EditPostModalProps {
  post: {
    id: string;
    caption: string | null;
    images: { url: string }[];
  };
  onClose: () => void;
  onSuccess: (updatedPost: any) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onClose, onSuccess }) => {
  const { isSubmitting, error, updatePost } = usePostStore();
  
  const [caption, setCaption] = useState(post.caption || '');
  const [existingImages, setExistingImages] = useState<{ url: string }[]>(post.images);
  const [removedUrls, setRemovedUrls] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalCount = existingImages.length + newImages.length + files.length;
    if (totalCount > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    setNewImages(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setNewPreviews(prev => [...prev, ...previews]);
  };

  const removeExistingImage = (url: string) => {
    if (existingImages.length + newImages.length <= 1) {
      alert('Post must have at least one image');
      return;
    }
    setExistingImages(prev => prev.filter(img => img.url !== url));
    setRemovedUrls(prev => [...prev, url]);
  };

  const removeNewImage = (index: number) => {
    const updatedImages = [...newImages];
    updatedImages.splice(index, 1);
    setNewImages(updatedImages);

    const updatedPreviews = [...newPreviews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setNewPreviews(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('caption', caption);
    
    removedUrls.forEach(url => {
      formData.append('removedImageUrls', url);
    });
    
    newImages.forEach(image => {
      formData.append('images', image);
    });

    try {
      await updatePost(post.id, formData);
      onSuccess({ ...post, caption, images: existingImages }); // This is a bit optimistic, usually backend returns the full object
      onClose();
    } catch (err) {
      console.error('Failed to update post:', err);
    }
  };

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose}>
        <motion.div 
          className={styles.modal} 
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
        >
          <div className={styles.header}>
            <h2>Edit Post</h2>
            <button className={styles['close-btn']} onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles['error-message']}>{error}</div>}

            <div className={styles.field}>
              <label><ImageIcon size={18} /> Photos</label>
              <div className={styles['preview-grid']}>
                {/* Existing Images */}
                {existingImages.map((img) => (
                  <div key={img.url} className={styles['preview-item']}>
                    <img src={img.url} alt="Existing" />
                    <button type="button" className={styles['remove-btn']} onClick={() => removeExistingImage(img.url)}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                {/* New Images */}
                {newPreviews.map((url, index) => (
                  <div key={url} className={styles['preview-item']}>
                    <img src={url} alt="New Preview" />
                    <button type="button" className={styles['remove-btn']} onClick={() => removeNewImage(index)}>
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {existingImages.length + newImages.length < 10 && (
                  <div className={styles['upload-area']} onClick={() => fileInputRef.current?.click()} style={{ padding: '20px' }}>
                    <Plus size={24} />
                  </div>
                )}
              </div>
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
                placeholder="Edit your caption..." 
                value={caption}
                onChange={e => setCaption(e.target.value)}
              />
            </div>
          </form>

          <div className={styles.footer}>
            <button type="button" className={styles['cancel-btn']} onClick={onClose}>Cancel</button>
            <button 
              type="submit" 
              className={styles['submit-btn']} 
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <><Loader2 size={20} className="animate-spin" /> Updating...</>
              ) : (
                <>Save Changes <Send size={18} /></>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditPostModal;
