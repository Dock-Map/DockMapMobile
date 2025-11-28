import { API_ENDPOINTS } from "@/src/shared/api/constants/api-endpoints";
import { api } from "@/src/shared/api/utils/axios-api-base";
import {
  ClubDto,
  ClubsFilterParamsDto,
  CreateClubDto,
  GetClubsApiRequest,
  GetClubsResponseDto,
} from "@/src/shared/api/types/data-contracts";
import { ApiRequest } from "@/src/shared/api/types/native-types-api";
import { CreateClubFormData } from "../modules/club/create-club-form/model/zod";
import * as ImagePickerExpo from 'expo-image-picker';

export type GetClubByIdApiRequest = ApiRequest<
  "CLUBS.BY_ID",
  { id: string },
  never,
  ClubDto
>;

export type CreateClubApiRequest = ApiRequest<
  "CLUBS.CREATE",
  never,
  CreateClubDto,
  ClubDto
>;

export type ClubsFilterParams = ClubsFilterParamsDto;

const DEFAULT_CLUBS_PARAMS: Required<Pick<ClubsFilterParams, "page" | "limit">> = {
  page: 1,
  limit: 10,
};

const normalizeResponse = (
  response: GetClubsResponseDto | undefined,
  params: ClubsFilterParams,
): GetClubsResponseDto => {
  if (response) {
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data : [],
    };
  }

  const page = params.page ?? DEFAULT_CLUBS_PARAMS.page;
  const limit = params.limit ?? DEFAULT_CLUBS_PARAMS.limit;

  return {
    data: [],
    total: 0,
    page,
    limit,
    totalPages: 0,
  };
};

export const clubsService = {
  async getClubs(
    filters: ClubsFilterParams = DEFAULT_CLUBS_PARAMS,
  ): Promise<GetClubsResponseDto> {
    const params: ClubsFilterParams = {
      ...DEFAULT_CLUBS_PARAMS,
      ...filters,
    };

    const response = await api.get<GetClubsApiRequest>({
      url: API_ENDPOINTS.CLUBS.ROOT,
      urlParams: params,
    });

    return normalizeResponse(response?.data as GetClubsResponseDto | undefined, params);
  },

  async getClubById(id: string): Promise<ClubDto> {
    const response = await api.get<GetClubByIdApiRequest>({
      url: API_ENDPOINTS.CLUBS.BY_ID,
      urlVariables: { id },
    });

    return response?.data as ClubDto;
  },

  async createClub(
    data: CreateClubDto,
    image?: ImagePickerExpo.ImagePickerAsset | null,
  ): Promise<ClubDto> {
    // Если есть изображение, отправляем как multipart/form-data
    if (image) {
      const formData = new FormData();
      
      // Добавляем файл
      formData.append('file', {
        uri: image.uri,
        type: image.mimeType || 'image/jpeg',
        name: image.fileName || `club-image-${Date.now()}.jpg`,
      } as any);

      // Добавляем все остальные поля
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof CreateClubDto];
        if (value !== undefined && value !== null) {
          // Массивы и объекты нужно сериализовать в JSON строки
          if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await api.post<CreateClubApiRequest>({
        url: API_ENDPOINTS.CLUBS.CREATE,
        body: formData as any, // FormData для multipart/form-data
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response?.data;
    }

    // Если изображения нет, отправляем как обычный JSON
    const response = await api.post<CreateClubApiRequest>({
      url: API_ENDPOINTS.CLUBS.CREATE,
      body: data,
    });
    return response?.data;
  },
};

export type { ClubDto };

