import { Router } from "express";
import racksController from "./racks.controller";

const router = Router();

router.get("/", (req, res, next) => racksController.getAll(req, res, next));
router.get("/:id", (req, res, next) => racksController.getById(req, res, next));
router.post("/", (req, res, next) => racksController.create(req, res, next));
router.put("/:id", (req, res, next) => racksController.update(req, res, next));
router.delete("/:id", (req, res, next) =>
  racksController.delete(req, res, next),
);

export default router;
