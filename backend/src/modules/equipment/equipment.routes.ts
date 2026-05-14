import { Router } from "express";
import equipmentController from "./equipment.controller";

const router = Router();

router.get("/", (req, res, next) => equipmentController.getAll(req, res, next));
router.get("/:id", (req, res, next) =>
  equipmentController.getById(req, res, next),
);
router.post("/", (req, res, next) =>
  equipmentController.create(req, res, next),
);
router.put("/:id", (req, res, next) =>
  equipmentController.update(req, res, next),
);
router.delete("/:id", (req, res, next) =>
  equipmentController.delete(req, res, next),
);

export default router;
