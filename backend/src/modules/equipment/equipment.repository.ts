import pool from "../../db/pool";
import {
  Equipment,
  CreateEquipmentDto,
  UpdateEquipmentDto,
} from "./equipment.interface";

class EquipmentRepository {
  async findAll(): Promise<Equipment[]> {
    const result = await pool.query<Equipment>(
      `SELECT * FROM equipment ORDER BY created_at DESC`,
    );
    return result.rows;
  }

  async findById(id: number): Promise<Equipment | null> {
    const result = await pool.query<Equipment>(
      `SELECT * FROM equipment WHERE id = $1`,
      [id],
    );
    return result.rows[0] || null;
  }

  async findByTag(tag: string): Promise<Equipment | null> {
    const result = await pool.query<Equipment>(
      `SELECT * FROM equipment WHERE LOWER(tag) = LOWER($1)`,
      [tag],
    );
    return result.rows[0] || null;
  }

  async findByRackId(rackId: number): Promise<Equipment[]> {
    const result = await pool.query<Equipment>(
      `SELECT * FROM equipment WHERE rack_id = $1 ORDER BY slot_number ASC`,
      [rackId],
    );
    return result.rows;
  }

  async isSlotOccupied(
    rackId: number,
    slotNumber: number,
    excludeId?: number,
  ): Promise<boolean> {
    const result = await pool.query(
      `SELECT id FROM equipment 
       WHERE rack_id = $1 AND slot_number = $2 AND id != $3`,
      [rackId, slotNumber, excludeId ?? 0],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async findAllPaginated(page: number, limit: number): Promise<Equipment[]> {
    const offset = (page - 1) * limit;
    const result = await pool.query<Equipment>(
      `SELECT * FROM equipment ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    return result.rows;
  }

  async count(): Promise<number> {
    const result = await pool.query(`SELECT COUNT(*) FROM equipment`);
    return parseInt(result.rows[0].count, 10);
  }

  async create(dto: CreateEquipmentDto): Promise<Equipment> {
    const result = await pool.query<Equipment>(
      `INSERT INTO equipment (name, type, make, tag, rack_id, slot_number)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        dto.name,
        dto.type,
        dto.make,
        dto.tag,
        dto.rack_id ?? null,
        dto.slot_number ?? null,
      ],
    );
    return result.rows[0];
  }

  async update(id: number, dto: UpdateEquipmentDto): Promise<Equipment | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(dto.name);
    }
    if (dto.type !== undefined) {
      fields.push(`type = $${idx++}`);
      values.push(dto.type);
    }
    if (dto.make !== undefined) {
      fields.push(`make = $${idx++}`);
      values.push(dto.make);
    }
    if (dto.tag !== undefined) {
      fields.push(`tag = $${idx++}`);
      values.push(dto.tag);
    }
    if (dto.rack_id !== undefined) {
      fields.push(`rack_id = $${idx++}`);
      values.push(dto.rack_id);
    }
    if (dto.slot_number !== undefined) {
      fields.push(`slot_number = $${idx++}`);
      values.push(dto.slot_number);
    }

    fields.push(`updated_at = $${idx++}`);
    values.push(new Date());
    values.push(id);

    const result = await pool.query<Equipment>(
      `UPDATE equipment SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values,
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(`DELETE FROM equipment WHERE id = $1`, [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  }
}

export default new EquipmentRepository();
