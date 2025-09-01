import { useMutation } from '@tanstack/react-query';
import { api } from '../../../shared/api/utils/axios-api-base';
import { API_ENDPOINTS } from '../../../shared/api/constants/api-endpoints';
import { MutationKey } from '../../../shared/api/constants/api-keys/mutation-key';
import {
  CompleteRegistrationDto,
  CompleteRegistrationResponseDto,
  CompleteRegistrationApiRequest,
} from '../../../shared/api/types/data-contracts';

export const completeRegistration = async (data: CompleteRegistrationDto): Promise<CompleteRegistrationResponseDto> => {
  const response = await api.post<CompleteRegistrationApiRequest>({
    url: API_ENDPOINTS.USER.COMPLETE_REGISTRATION,
    body: data,
  });
  
  const result = response?.data;
  
  // Проверяем поле success в ответе
  if (!result?.success) {
    throw new Error(result?.message || 'Ошибка при завершении регистрации');
  }
  
  return result;
};

export const useCompleteRegistration = () => {
  return useMutation({
    mutationKey: [MutationKey.COMPLETE_REGISTRATION],
    mutationFn: completeRegistration,
  });
};
