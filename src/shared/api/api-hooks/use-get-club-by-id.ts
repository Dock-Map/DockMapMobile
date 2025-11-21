import { QueryKey } from "@/src/shared/api/constants/api-keys/query-key";
import { useAppQuery } from "@/src/shared/api/api-hooks/use-app-query";
import { clubsService } from "@/src/services/clubs.service";
import { ClubDto } from "@/src/shared/api/types/data-contracts";

export const useGetClubById = (id: string | undefined) => {
  return useAppQuery<ClubDto>(
    QueryKey.GET_CLUB_BY_ID,
    [id],
    () => {
      if (!id) {
        throw new Error("Club ID is required");
      }
      return clubsService.getClubById(id);
    },
    {
      enabled: !!id,
    },
  );
};

