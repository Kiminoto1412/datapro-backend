import { Router } from "express";
import employee from "@/routes/api/employee";

const router: Router = Router();

router.use("/employee", employee);

export default router;
