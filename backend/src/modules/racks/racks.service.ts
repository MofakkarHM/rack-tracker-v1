import racksRepository from "./racks.repository";
import { CreateRackInput, UpdateRackInput } from "./racks.schema";
import { Rack } from "./racks.interface";
import { AppError } from "../../middleware/errorHandler";

class RacksService {
  async getAll(): Promise<Rack[]> {
    return racksRepository.findAll();
  }

  async getById(id: number): Promise<Rack> {
    const rack = await racksRepository.findById(id);
    if (!rack) {
      const err: AppError = new Error(`Rack with id ${id} not found`);
      err.statusCode = 404;
      throw err;
    }
    return rack;
  }

  async create(data: CreateRackInput): Promise<Rack> {
    const existing = await racksRepository.findByName(data.name);
    if (existing) {
      const err: AppError = new Error(
        `Rack with name "${data.name}" already exists`,
      );
      err.statusCode = 400;
      throw err;
    }
    return racksRepository.create(data);
  }

  async update(id: number, data: UpdateRackInput): Promise<Rack> {
    await this.getById(id); // throws 404 if not found

    if (data.name) {
      const existing = await racksRepository.findByName(data.name);
      if (existing && existing.id !== id) {
        const err: AppError = new Error(
          `Rack with name "${data.name}" already exists`,
        );
        err.statusCode = 400;
        throw err;
      }
    }

    const updated = await racksRepository.update(id, data);
    return updated!;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id); // throws 404 if not found
    await racksRepository.delete(id);
  }
}

export default new RacksService();
