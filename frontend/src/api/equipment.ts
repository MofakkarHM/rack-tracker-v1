import api from "../lib/axios";
import type {
  Equipment,
  CreateEquipmentInput,
  UpdateEquipmentInput,
  PaginatedEquipmentResponse,
} from "../types/equipment";

export const equipmentApi = {
  getAll: async (): Promise<Equipment[]> => {
    const res = await api.get("/api/equipment");
    return res.data.data;
  },

  getById: async (id: number): Promise<Equipment> => {
    const res = await api.get(`/api/equipment/${id}`);
    return res.data.data;
  },

  create: async (data: CreateEquipmentInput): Promise<Equipment> => {
    const res = await api.post("/api/equipment", data);
    return res.data.data;
  },

  update: async (
    id: number,
    data: UpdateEquipmentInput,
  ): Promise<Equipment> => {
    const res = await api.put(`/api/equipment/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/equipment/${id}`);
  },

  getPaginated: async (
    page: number,
    limit: number,
  ): Promise<PaginatedEquipmentResponse> => {
    const res = await api.get(`/api/equipment?page=${page}&limit=${limit}`);
    return res.data;
  },
};
