import * as yup from "yup";

/**
 * @description This Function is dedicataed to be used in react-hook-form
 * with Yup Resolver
 * @param schema 
 * @param field 
 * @returns {Boolean}
 */
const isFieldRequired = <T extends object>(schema: yup.AnyObjectSchema, field: keyof T): boolean => {
    const fieldName = schema.describe().fields[field as string]
    if (!fieldName) throw new Error(`Field '${field as string}' not found in schema`)
    const isArrayType = fieldName.type === 'array'
    return (fieldName as yup.SchemaDescription).tests.some((test) => test.name === 'required' || (test.name === 'min' && !!isArrayType) || test.name === 'min')
}

export default isFieldRequired;