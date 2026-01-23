/**
 * Utilitário para feedback háptico (vibração)
 */

export const haptics = {
  // Vibração leve (clique)
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  // Vibração média (seleção)
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },

  // Vibração forte (confirmação)
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }
  },

  // Vibração de sucesso
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10, 50, 10]);
    }
  },

  // Vibração de erro
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }
  },

  // Vibração de notificação
  notification: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }
  },

  // Vibração de warning
  warning: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }
};
