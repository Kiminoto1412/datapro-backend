import { MysqlDataSource } from "@/data-source/mysql";
import { NextFunction, Request, Response } from "express";
import { Employee } from "@/entities/mysql/Employee";
import EmployeeService from "@/services/employee";
import { IEmployee } from "@/interfaces/IEmployee";
import ValidationUtils from "@/utils/validation";
import employee from "@/utils/validationSchema/employee.json";

export default class EmployeeController {
  private employeeRepository = MysqlDataSource.getRepository(Employee);

  public static async all(req: Request, res: Response, next: NextFunction) {
    try {
      const [payload] = await EmployeeService.getAll();
      res.json({ status: 200, payload: payload });
    } catch (err) {
      next(err);
    }
  }

  public static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const employee = await EmployeeService.getOne(employeeId);
      console.log("employee", employee);

      res.json({ status: 200, payload: employee });
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body: IEmployee = req.body;
      await ValidationUtils.schema(body, employee);
      await EmployeeService.create(body);
      res.json({ status: 200, message: "create employee success" });
    } catch (err) {
      next(err);
    }
  }

  public static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const employeeId = parseInt(req.params.employeeId);
      await EmployeeService.remove(employeeId);
      res.json({ status: 200, message: "employee has been removed" });
    } catch (err) {
      next(err);
    }
  }
}
