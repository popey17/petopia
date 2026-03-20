import React from 'react';
import { AlertCircle, Trash2, X } from 'lucide-react';
import styles from './DeleteConfirmModal.module.scss';

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ onConfirm, onCancel, isLoading }) => {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onCancel}>
          <X size={20} />
        </button>
        
        <div className={styles.iconWrapper}>
          <AlertCircle size={48} className={styles.alertIcon} />
        </div>
        
        <h2>Delete Post?</h2>
        <p>This will permanently remove this adorable memory from Petopia. This action cannot be undone.</p>
        
        <div className={styles.actions}>
          <button 
            className={styles.cancelBtn} 
            onClick={onCancel}
            disabled={isLoading}
          >
            Go Back
          </button>
          <button 
            className={styles.deleteBtn} 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : (
              <>
                <Trash2 size={18} />
                Delete Forever
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
