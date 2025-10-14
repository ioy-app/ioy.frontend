export const cacheTime = 1000 * 60 * 60;

// Вспомогательная функция для получения кэша из localStorage
export const getCache = (key: string) => {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Проверяем, не истекло ли время кэша
        if (Date.now() - parsed.timestamp < cacheTime) {
          return parsed.data;
        }
      }
    } catch (e) {
      console.error('Ошибка при чтении кэша из localStorage:', e);
    }
    return null;
  };
  
  // Вспомогательная функция для сохранения кэша в localStorage
export const saveCache = (key: string, data: any) => {
    try {
      const cacheData = {
        timestamp: Date.now(),
        data: data
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (e) {
      console.error('Ошибка при сохранении кэша в localStorage:', e);
    }
  };

  export const clearCache = (key: string) => {
    try {
      localStorage.removeItem(key);
    }
    catch(e) {
      console.error('Ошибка при очистке кэша из localStorage:', e);
    }
    return null;
  }