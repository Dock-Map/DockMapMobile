import { useEffect, useState, useRef } from 'react';

/**
 * Хук для дебаунса значения
 * @param value - значение для дебаунса
 * @param delay - задержка в миллисекундах (по умолчанию 500ms)
 * @returns дебаунсированное значение
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Очищаем предыдущий таймер
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Устанавливаем новый таймер
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очистка при размонтировании или изменении зависимостей
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

