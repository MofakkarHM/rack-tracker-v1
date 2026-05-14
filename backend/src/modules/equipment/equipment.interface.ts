export interface Equipment {
  id: number;
  name: string;
  type: string;
  make: string;
  tag: string;
  rack_id: number | null;
  slot_number: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateEquipmentDto {
  name: string;
  type: string;
  make: string;
  tag: string;
  rack_id?: number | null;
  slot_number?: number | null;
}

export interface UpdateEquipmentDto {
  name?: string;
  type?: string;
  make?: string;
  tag?: string;
  rack_id?: number | null;
  slot_number?: number | null;
}
