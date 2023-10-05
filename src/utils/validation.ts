import { validate } from 'jsonschema'

export default class ValidationUtils {
  public static async schema(
    data: any,
    schemaJson: any,
    maxItems?: number
  ): Promise<any> {
    let schema = await schemaJson

    if (maxItems) {
      schema = { ...schema, ...{ maxItems: maxItems } }
    }
    if (!validate(data, schema).valid) {
      throw validate(data, schema, { throwError: true })
    }
    if (new Date(data.startDate) > new Date(data.endDate)) {
      throw { status: 400, message: 'startDate must be before endDate' }
    }
  }

 
}