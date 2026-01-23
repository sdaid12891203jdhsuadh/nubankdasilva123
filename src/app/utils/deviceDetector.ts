/**
 * Utilitário para detectar informações do dispositivo
 */

export const deviceDetector = {
  // Detecta especificações do dispositivo
  getDeviceInfo: () => {
    const ua = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    
    // Estima RAM (aproximado)
    const memory = (navigator as any).deviceMemory || 4;
    
    // Detecta cores da tela
    const colorDepth = window.screen.colorDepth;
    
    // Detecta resolução
    const width = window.screen.width;
    const height = window.screen.height;
    
    // Detecta pixel ratio
    const pixelRatio = window.devicePixelRatio || 1;
    
    return {
      isMobile,
      isAndroid,
      isIOS,
      memory,
      colorDepth,
      width,
      height,
      pixelRatio,
      userAgent: ua
    };
  },

  // Verifica se o dispositivo é compatível
  isCompatible: () => {
    const info = deviceDetector.getDeviceInfo();
    
    // Requisitos mínimos
    const minMemory = 2; // GB
    const minWidth = 320;
    
    return info.memory >= minMemory && info.width >= minWidth;
  },

  // Recomenda configurações baseado no dispositivo
  getRecommendedSettings: () => {
    const info = deviceDetector.getDeviceInfo();
    
    if (info.memory >= 8) {
      return {
        quality: 'ultra',
        label: 'Dispositivo High-End Detectado',
        description: 'Todas features ativadas',
        color: '#00ff00'
      };
    } else if (info.memory >= 4) {
      return {
        quality: 'high',
        label: 'Dispositivo Mid-Range',
        description: 'Modo balanceado recomendado',
        color: '#ffaa00'
      };
    } else {
      return {
        quality: 'low',
        label: 'Dispositivo Entry-Level',
        description: 'Modo otimizado ativado',
        color: '#ff5555'
      };
    }
  },

  // Detecta se tem giroscópio
  hasGyroscope: async (): Promise<boolean> => {
    if ('DeviceOrientationEvent' in window) {
      return new Promise((resolve) => {
        const handler = (e: DeviceOrientationEvent) => {
          if (e.alpha !== null) {
            resolve(true);
          } else {
            resolve(false);
          }
          window.removeEventListener('deviceorientation', handler);
        };
        
        window.addEventListener('deviceorientation', handler);
        
        // Timeout após 1 segundo
        setTimeout(() => {
          window.removeEventListener('deviceorientation', handler);
          resolve(false);
        }, 1000);
      });
    }
    return false;
  },

  // Mede performance do dispositivo
  measurePerformance: (): number => {
    const start = performance.now();
    
    // Simula carga de CPU
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i);
    }
    
    const end = performance.now();
    const duration = end - start;
    
    // Quanto menor o tempo, melhor o score (0-100)
    const score = Math.max(0, Math.min(100, 100 - duration * 2));
    
    return Math.round(score);
  }
};
