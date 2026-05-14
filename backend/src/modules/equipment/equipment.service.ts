import equipmentRepository from "./equipment.repository";
import racksRepository from "../racks/racks.repository";
import { CreateEquipmentInput, UpdateEquipmentInput } from "./equipment.schema";
import { Equipment } from "./equipment.interface";
import { AppError } from "../../middleware/errorHandler";

class EquipmentService {
  async getAll(): Promise<Equipment[]> {
    return equipmentRepository.findAll();
  }

  async getById(id: number): Promise<Equipment> {
    const equipment = await equipmentRepository.findById(id);
    if (!equipment) {
      const err: AppError = new Error(`Equipment with id ${id} not found`);
      err.statusCode = 404;
      throw err;
    }
    return equipment;
  }

  async create(data: CreateEquipmentInput): Promise<Equipment> {
    // unique tag check
    const existingTag = await equipmentRepository.findByTag(data.tag);
    if (existingTag) {
      const err: AppError = new Error(
        `Equipment with tag "${data.tag}" already exists`,
      );
      err.statusCode = 400;
      throw err;
    }

    // rack + slot validation
    if (data.rack_id != null && data.slot_number != null) {
      const rack = await racksRepository.findById(data.rack_id);
      if (!rack) {
        const err: AppError = new Error(
          `Rack with id ${data.rack_id} not found`,
        );
        err.statusCode = 404;
        throw err;
      }
      if (data.slot_number > rack.total_slots) {
        const err: AppError = new Error(
          `Slot ${data.slot_number} exceeds rack capacity of ${rack.total_slots}`,
        );
        err.statusCode = 400;
        throw err;
      }
      const occupied = await equipmentRepository.isSlotOccupied(
        data.rack_id,
        data.slot_number,
      );
      if (occupied) {
        const err: AppError = new Error(
          `Slot ${data.slot_number} in rack ${rack.name} is already occupied`,
        );
        err.statusCode = 400;
        throw err;
      }
    }

    return equipmentRepository.create(data);
  }

  async update(id: number, data: UpdateEquipmentInput): Promise<Equipment> {
    const current = await this.getById(id); // throws 404 if not found

    if (data.tag) {
      const existingTag = await equipmentRepository.findByTag(data.tag);
      if (existingTag && existingTag.id !== id) {
        const err: AppError = new Error(
          `Equipment with tag "${data.tag}" already exists`,
        );
        err.statusCode = 400;
        throw err;
      }
    }

    const newRackId =
      data.rack_id !== undefined ? data.rack_id : current.rack_id;
    const newSlotNumber =
      data.slot_number !== undefined ? data.slot_number : current.slot_number;

    if (newRackId != null && newSlotNumber != null) {
      const rack = await racksRepository.findById(newRackId);
      if (!rack) {
        const err: AppError = new Error(`Rack with id ${newRackId} not found`);
        err.statusCode = 404;
        throw err;
      }
      if (newSlotNumber > rack.total_slots) {
        const err: AppError = new Error(
          `Slot ${newSlotNumber} exceeds rack capacity of ${rack.total_slots}`,
        );
        err.statusCode = 400;
        throw err;
      }
      const occupied = await equipmentRepository.isSlotOccupied(
        newRackId,
        newSlotNumber,
        id,
      );
      if (occupied) {
        const err: AppError = new Error(
          `Slot ${newSlotNumber} in rack ${rack.name} is already occupied`,
        );
        err.statusCode = 400;
        throw err;
      }
    }

    const updated = await equipmentRepository.update(id, data);
    return updated!;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await equipmentRepository.delete(id);
  }
}

export default new EquipmentService();
