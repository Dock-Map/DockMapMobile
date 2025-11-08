import { InteractionManager } from 'react-native';
import { toast } from 'sonner-native';

/**
 * Безопасная обертка для toast, которая предотвращает ошибки
 * при вызове после размонтирования компонента
 */
const safeToast = {
  success: (message: string, options?: Parameters<typeof toast.success>[1]) => {
    InteractionManager.runAfterInteractions(() => {
      try {
        toast.success(message, options);
      } catch (error) {
        // Игнорируем ошибки при размонтировании
        console.warn('Toast error (component unmounted):', error);
      }
    });
  },
  error: (message: string, options?: Parameters<typeof toast.error>[1]) => {
    InteractionManager.runAfterInteractions(() => {
      try {
        toast.error(message, options);
      } catch (error) {
        // Игнорируем ошибки при размонтировании
        console.warn('Toast error (component unmounted):', error);
      }
    });
  },
  info: (message: string, options?: Parameters<typeof toast.info>[1]) => {
    InteractionManager.runAfterInteractions(() => {
      try {
        toast.info(message, options);
      } catch (error) {
        console.warn('Toast error (component unmounted):', error);
      }
    });
  },
  warning: (message: string, options?: Parameters<typeof toast.warning>[1]) => {
    InteractionManager.runAfterInteractions(() => {
      try {
        toast.warning(message, options);
      } catch (error) {
        console.warn('Toast error (component unmounted):', error);
      }
    });
  },
};

export const showToast = safeToast;