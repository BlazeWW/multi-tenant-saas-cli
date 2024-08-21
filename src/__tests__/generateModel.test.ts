import { jest } from '@jest/globals'
import * as fs from 'fs-extra'
import { execSync } from 'node:child_process'
import * as path from 'path'

// Mock the @inquirer/prompts module
jest.mock('@inquirer/prompts', () => ({
	input: jest.fn(),
	select: jest.fn()
}))

import { input, select } from '@inquirer/prompts'

describe('generateModel Command', () => {
	const entityDir = path.resolve(__dirname, '../src/entity')
	const entityPath = path.resolve(entityDir, 'Product.ts')

	beforeEach(() => {
		// Clear the mocks before each test
		jest.clearAllMocks()
		// Ensure the entity directory is clean before each test
		if (fs.existsSync(entityDir)) {
			fs.rmSync(entityDir, { recursive: true, force: true })
		}
	})

	afterEach(() => {
		// Clean up the generated files after each test
		if (fs.existsSync(entityDir)) {
			fs.rmSync(entityDir, { recursive: true, force: true })
		}
	})

	it('should prompt for a model name and fields, then generate a TypeORM entity file', async () => {
		// Mock user inputs
		;(input as jest.Mock).mockResolvedValueOnce('Product') // First input for model name
		;(input as jest.Mock)
			.mockResolvedValueOnce('name') // First field name
			.mockResolvedValueOnce('price') // Second field name
			.mockResolvedValueOnce('') // Ending the loop
		;(select as jest.Mock)
			.mockResolvedValueOnce('string') // Type for 'name' field
			.mockResolvedValueOnce('number') // Type for 'price' field

		// Execute the command
		execSync('node dist/index.js generate-model')

		// Check if the file was generated
		expect(fs.existsSync(entityPath)).toBe(true)

		// Check the contents of the generated file
		const generatedContent = fs.readFileSync(entityPath, 'utf-8')
		expect(generatedContent).toContain('export class Product')
		expect(generatedContent).toContain('name: string')
		expect(generatedContent).toContain('price: number')
	})
})
