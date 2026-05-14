import pool from "../../db/pool";
import { Rack, CreateRackDto, UpdateRackDto } from "./racks.interface";

class RacksRepository {
  async findAll(): Promise<Rack[]> {
    const result = await pool.query<Rack>(
      `SELECT * FROM racks ORDER BY created_at DESC`,
    );
    return result.rows;
  }

  async findById(id: number): Promise<Rack | null> {
    const result = await pool.query<Rack>(`SELECT * FROM racks WHERE id = $1`, [
      id,
    ]);
    return result.rows[0] || null;
  }

  async findByName(name: string): Promise<Rack | null> {
    const result = await pool.query<Rack>(
      `SELECT * FROM racks WHERE LOWER(name) = LOWER($1)`,
      [name],
    );
    return result.rows[0] || null;
  }

  async create(dto: CreateRackDto): Promise<Rack> {
    const result = await pool.query<Rack>(
      `INSERT INTO racks (name, location, total_slots)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [dto.name, dto.location, dto.total_slots],
    );
    return result.rows[0];
  }

  async update(id: number, dto: UpdateRackDto): Promise<Rack | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(dto.name);
    }
    if (dto.location !== undefined) {
      fields.push(`location = $${idx++}`);
      values.push(dto.location);
    }
    if (dto.total_slots !== undefined) {
      fields.push(`total_slots = $${idx++}`);
      values.push(dto.total_slots);
    }

    fields.push(`updated_at = $${idx++}`);
    values.push(new Date());
    values.push(id);

    const result = await pool.query<Rack>(
      `UPDATE racks SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values,
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(`DELETE FROM racks WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

export default new RacksRepository();
