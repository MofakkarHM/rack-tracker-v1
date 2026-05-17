import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { racksApi } from "../api/racks";
import { queryKeys } from "../lib/queryKeys";
import type { CreateRackInput, UpdateRackInput } from "../types/rack";

export function useRacks() {
  return useQuery({
    queryKey: queryKeys.racks.all,
    queryFn: racksApi.getAll,
  });
}

export function useCreateRack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRackInput) => racksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.racks.all });
    },
  });
}

export function useUpdateRack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRackInput }) =>
      racksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.racks.all });
    },
  });
}

export function useDeleteRack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => racksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.racks.all });
    },
  });
}
