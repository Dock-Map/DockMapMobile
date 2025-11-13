import { API_ENDPOINTS } from "@/src/shared/api/constants/api-endpoints";
import { api } from "@/src/shared/api/utils/axios-api-base";
import {
  ClubDto,
  ClubsFilterParamsDto,
  GetClubsApiRequest,
  GetClubsResponseDto,
} from "@/src/shared/api/types/data-contracts";

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
};

export type { ClubDto };

