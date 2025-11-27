import { clubsService } from "@/src/services/clubs.service";
import { QueryKey } from "@/src/shared/api/constants/api-keys/query-key";
import { showToast } from "@/src/shared/utils/show-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MutationKey } from "../constants/api-keys/mutation-key";
import { CreateClubDto } from "../types/data-contracts";

export const useCreateClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MutationKey.USER_CREATE_CLUB],
    mutationFn: (data: CreateClubDto) => clubsService.createClub(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_CLUBS] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      showToast.error(error?.response?.data?.message || "An error occurred", {
        duration: 10000,
      });
    },
  });
};
