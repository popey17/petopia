import { create } from 'zustand';

interface PostState {
  isModalOpen: boolean;
  isSubmitting: boolean;
  error: string | null;
  openModal: () => void;
  closeModal: () => void;
  createPost: (formData: FormData) => Promise<void>;
  updatePost: (postId: string, formData: FormData) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  version: number;
  triggerRefresh: () => void;
}

export const usePostStore = create<PostState>((set) => ({
  isModalOpen: false,
  isSubmitting: false,
  error: null,
  version: 0,
  triggerRefresh: () => set((state) => ({ version: state.version + 1 })),
  openModal: () => set({ isModalOpen: true, error: null }),
  closeModal: () => set({ isModalOpen: false, error: null }),
  createPost: async (formData: FormData) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
        method: 'POST',
        body: formData, // No Content-Type header needed for FormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      set((state) => ({ 
        isSubmitting: false,
        isModalOpen: false,
        version: state.version + 1
      }));
      
      // Success - could trigger a refresh here if needed
      // window.location.reload(); // Simple refresh for now or use a shared feed store
    } catch (error: unknown) {
      set({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isSubmitting: false 
      });
      throw error;
    }
  },
  updatePost: async (postId: string, formData: FormData) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`, {
        method: 'PATCH',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update post');
      }

      set((state) => ({ isSubmitting: false, version: state.version + 1 }));
    } catch (error: unknown) {
      set({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isSubmitting: false 
      });
      throw error;
    }
  },
  deletePost: async (postId: string) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete post');
      }

      set((state) => ({ isSubmitting: false, version: state.version + 1 }));
    } catch (error: unknown) {
      set({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isSubmitting: false 
      });
      throw error;
    }
  },
  likePost: async (postId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to like post');
      }

      set((state) => ({ version: state.version + 1 }));
    } catch (error) {
      console.error('Like error:', error);
      throw error;
    }
  },
  unlikePost: async (postId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/like`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to unlike post');
      }

      set((state) => ({ version: state.version + 1 }));
    } catch (error) {
      console.error('Unlike error:', error);
      throw error;
    }
  },
}));
