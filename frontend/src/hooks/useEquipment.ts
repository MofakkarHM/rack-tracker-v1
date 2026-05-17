import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { equipmentApi } from "../api/equipment";
import { queryKeys } from "../lib/queryKeys";
import type {
  CreateEquipmentInput,
  UpdateEquipmentInput,
  PaginatedEquipmentResponse,
} from "../types/equipment";

export function useEquipment() {
  return useQuery({
    queryKey: queryKeys.equipment.all,
    queryFn: equipmentApi.getAll,
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEquipmentInput) => equipmentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all });
    },
  });
}

export function useUpdateEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEquipmentInput }) =>
      equipmentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all });
    },
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => equipmentApi.delete(id),

    // Optimistic update
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.equipment.all });
      const previousEquipment = queryClient.getQueryData(
        queryKeys.equipment.all,
      );

      queryClient.setQueryData(queryKeys.equipment.all, (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.filter((equipment: any) => equipment.id !== deletedId),
        };
      });

      return { previousEquipment };
    },

    // Rollback on error
    onError: (err, deletedId, context) => {
      if (context?.previousEquipment) {
        queryClient.setQueryData(
          queryKeys.equipment.all,
          context.previousEquipment,
        );
      }
    },

    // Always refetch to ensure sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all });
    },
  });
}

export function usePaginatedEquipment(page: number, limit: number) {
  return useQuery<PaginatedEquipmentResponse>({
    queryKey: [...queryKeys.equipment.all, "paginated", page, limit],
    queryFn: () => equipmentApi.getPaginated(page, limit),
  });
}
