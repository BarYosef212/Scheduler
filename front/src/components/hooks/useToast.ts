import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

export const useToast = () => {
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    Toastify({
      text,
      duration: 3000,
      className: type,
      gravity: 'top',
      position: 'center',
      style: {
        background: type === 'success'
          ? 'linear-gradient(to right, #00b09b, #96c93d)'
          : 'linear-gradient(to right, #ff0000, #ff5f6d)',
      },
    }).showToast();
  };

  return { showToast };
};
