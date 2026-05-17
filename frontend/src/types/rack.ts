export interface Rack {
  id: number;
  name: string;
  location: string;
  total_slots: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRackInput {
  name: string;
  location: string;
  total_slots: number;
}

export interface UpdateRackInput {
  name?: string;
  location?: string;
  total_slots?: number;
}
