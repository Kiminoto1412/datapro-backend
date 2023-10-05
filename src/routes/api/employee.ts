import { Router } from "express";
import EmployeeController from "@/controllers/EmployeeController";

const router: Router = Router();

router.post("/", EmployeeController.create);
router.delete("/:employeeId", EmployeeController.remove);
router.get("/:employeeId", EmployeeController.getOne);
router.get("/", EmployeeController.all);

export default router;
