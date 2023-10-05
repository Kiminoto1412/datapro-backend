import { MysqlDataSource } from "@/data-source/mysql";
import { Employee } from "@/entities/mysql/Employee";
import { IEmployee } from "@/interfaces/IEmployee";
import CustomError from "@/utils/customError";

export default class EmployeeService {
  static employeeRepository = MysqlDataSource.getRepository(Employee);

  public static async getAll(): Promise<any> {
    try {
      return await EmployeeService.employeeRepository.find();
    } catch (err) {
      throw err;
    }
  }

  public static async getOne(employeeId: number): Promise<any> {
    try {
      const employee = await EmployeeService.employeeRepository.findOne({
        where: { id: employeeId },
      });

      if (!employee) {
        throw new CustomError("employee not found.", 400);
      }
      return employee;
    } catch (err) {
      throw err;
    }
  }

  public static async create(body: IEmployee): Promise<any> {
    try {
      const employee = await EmployeeService.employeeRepository.findOne({
        where: { name: body.name },
      });
      if (!employee) {
        return await EmployeeService.employeeRepository.save(body);
      } else {
        throw new CustomError("employee is already exist.", 400);
      }
    } catch (err) {
      throw err;
    }
  }

  public static async remove(employeeId: number): Promise<any> {
    try {
      const employee = await EmployeeService.employeeRepository.findOne({
        where: { id: employeeId },
      });
      if (!employee) {
        throw new CustomError("employee doesn't exist.", 400);
      }
      await this.employeeRepository.softRemove(employee);
    } catch (err) {
      throw err;
    }
  }
}
