import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/api/utils/axios-api-base';
import { API_ENDPOINTS } from '../../../shared/api/constants/api-endpoints';
import { QueryKey } from '../../../shared/api/constants/api-keys/query-key';
import {
  GetCitiesResponseDto,
  GetCitiesApiRequest,
} from '../../../shared/api/types/data-contracts';

export const getCities = async (): Promise<GetCitiesResponseDto> => {
  const response = await api.get<GetCitiesApiRequest>({
    url: API_ENDPOINTS.USER.GET_CITIES,
  });
  
  return response?.data || [];
};

export const useGetCities = () => {
  return useQuery({
    queryKey: [QueryKey.GET_CITIES],
    queryFn: getCities,
  });
};
