// Временная заглушка для city service
export interface City {
  id: string;
  name: string;
}

export const cityService = {
  getCities: async (): Promise<City[]> => {
    // Заглушка с примерными городами
    return [
      { id: '1', name: 'Москва' },
      { id: '2', name: 'Санкт-Петербург' },
      { id: '3', name: 'Новосибирск' },
      { id: '4', name: 'Екатеринбург' },
      { id: '5', name: 'Казань' },
    ];
  }
};
