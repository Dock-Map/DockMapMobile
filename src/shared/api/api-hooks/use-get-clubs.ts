import { QueryKey } from "@/src/shared/api/constants/api-keys/query-key";
import { useAppQuery } from "@/src/shared/api/api-hooks/use-app-query";
import {
  clubsService,
  ClubsFilterParams,
} from "@/src/services/clubs.service";

const EMPTY_FILTERS = Object.freeze({}) as ClubsFilterParams;

export const useGetClubs = (filters?: ClubsFilterParams) => {
  const params = filters ?? EMPTY_FILTERS;

  return useAppQuery(
    QueryKey.GET_CLUBS,
    [params],
    () => clubsService.getClubs(params === EMPTY_FILTERS ? undefined : params),
  );
};

