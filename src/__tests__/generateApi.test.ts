import { execSync } from 'child_process'
import * as fs from 'fs-extra'
import * as path from 'path'

describe('generateApi Command', () => {
	const outputPath = path.resolve(__dirname, '../output/testApi.ts')

	afterEach(() => {
		// Clean up generated files after each test
		if (fs.existsSync(outputPath)) {
			fs.removeSync(outputPath)
		}
	})

	it('should generate a basic API file', () => {
		execSync('node dist/index.js generate-api testApi')
		const output = fs.readFileSync(outputPath, 'utf-8')
		expect(output).toContain('export const testApi = async')
		expect(output).toContain('message: "testApi endpoint generated"')
	})

	it('should include AWS Cognito authentication if specified', () => {
		execSync('node dist/index.js generate-api testApi -a')
		const output = fs.readFileSync(outputPath, 'utf-8')
		expect(output).toContain('const user = await authenticateUser(event);')
	})

	it('should include PostgreSQL database interaction if specified', () => {
		execSync('node dist/index.js generate-api testApi -d')
		const output = fs.readFileSync(outputPath, 'utf-8')
		expect(output).toContain('const data = await fetchDataFromDB();')
	})

	it('should include both Cognito and DB if both options are specified', () => {
		execSync('node dist/index.js generate-api testApi -a -d')
		const output = fs.readFileSync(outputPath, 'utf-8')
		expect(output).toContain('const user = await authenticateUser(event);')
		expect(output).toContain('const data = await fetchDataFromDB();')
	})
})
