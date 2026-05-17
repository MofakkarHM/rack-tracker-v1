import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { equipmentApi } from "../api/equipment";
import { queryKeys } from "../lib/queryKeys";
import type {
  CreateEquipmentInput,
  UpdateEquipmentInput,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all });
    },
  });
}
