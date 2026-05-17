import { Request, Response, NextFunction } from "express";
import equipmentService from "./equipment.service";
import {
  createEquipmentSchema,
  updateEquipmentSchema,
} from "./equipment.schema";

class EquipmentController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 0;
      const limit = parseInt(req.query.limit as string) || 0;

      if (page && limit) {
        const result = await equipmentService.getAllPaginated(page, limit);
        res.json({ success: true, ...result });
      } else {
        const equipment = await equipmentService.getAll();
        res.json({ success: true, data: equipment });
      }
    } catch (err) {
      next(err);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const equipment = await equipmentService.getById(Number(req.params.id));
      res.json({ success: true, data: equipment });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = await createEquipmentSchema.safeParseAsync(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }
      const equipment = await equipmentService.create(parsed.data);
      res.status(201).json({ success: true, data: equipment });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = updateEquipmentSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }
      const equipment = await equipmentService.update(
        Number(req.params.id),
        parsed.data,
      );
      res.json({ success: true, data: equipment });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await equipmentService.delete(Number(req.params.id));
      res.json({ success: true, message: "Equipment deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

export default new EquipmentController();
