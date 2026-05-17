import api from "../lib/axios";
import type { Rack, CreateRackInput, UpdateRackInput } from "../types/rack";

export const racksApi = {
  getAll: async (): Promise<Rack[]> => {
    const res = await api.get("/api/racks");
    return res.data.data;
  },

  getById: async (id: number): Promise<Rack> => {
    const res = await api.get(`/api/racks/${id}`);
    return res.data.data;
  },

  create: async (data: CreateRackInput): Promise<Rack> => {
    const res = await api.post("/api/racks", data);
    return res.data.data;
  },

  update: async (id: number, data: UpdateRackInput): Promise<Rack> => {
    const res = await api.put(`/api/racks/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/racks/${id}`);
  },
};
