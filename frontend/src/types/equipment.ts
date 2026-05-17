export type EquipmentType =
  | "server"
  | "switch"
  | "firewall"
  | "storage"
  | "patch"
  | "other";

export interface Equipment {
  id: number;
  name: string;
  type: EquipmentType;
  make: string;
  tag: string;
  rack_id: number | null;
  slot_number: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEquipmentInput {
  name: string;
  type: EquipmentType;
  make: string;
  tag: string;
  rack_id?: number | null;
  slot_number?: number | null;
}

export interface UpdateEquipmentInput {
  name?: string;
  type?: EquipmentType;
  make?: string;
  tag?: string;
  rack_id?: number | null;
  slot_number?: number | null;
}

export interface PaginatedEquipmentResponse {
  data: Equipment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
