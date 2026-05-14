export interface Rack {
  id: number;
  name: string;
  location: string;
  total_slots: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRackDto {
  name: string;
  location: string;
  total_slots: number;
}

export interface UpdateRackDto {
  name?: string;
  location?: string;
  total_slots?: number;
}
