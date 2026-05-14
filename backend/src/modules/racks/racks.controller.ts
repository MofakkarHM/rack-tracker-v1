import { Request, Response, NextFunction } from "express";
import { createRackSchema, updateRackSchema } from "./racks.schema";
import racksService from "./racks.service";

class RacksController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const racks = await racksService.getAll();
      res.json({ success: true, data: racks });
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
      const rack = await racksService.getById(Number(req.params.id));
      res.json({ success: true, data: rack });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createRackSchema.safeParse(req.body);
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
      const rack = await racksService.create(parsed.data);
      res.status(201).json({ success: true, data: rack });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = updateRackSchema.safeParse(req.body);
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
      const rack = await racksService.update(
        Number(req.params.id),
        parsed.data,
      );
      res.json({ success: true, data: rack });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await racksService.delete(Number(req.params.id));
      res.json({ success: true, message: "Rack deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

export default new RacksController();
