import * as employeeRepository from "../repositories/employeeRepository.js"
import * as errors from "../utils/errors.js"

export async function employeeRegister(employeeId:number, companyId:number) {
	const employee = await employeeRepository.findById(employeeId)

	if(!employee) {
		throw errors.notFound("Not found")
	}

	if(employee.companyId !== companyId) {
		throw errors.forbidden("Employee is assigned to another company")
	}

	return employee
}