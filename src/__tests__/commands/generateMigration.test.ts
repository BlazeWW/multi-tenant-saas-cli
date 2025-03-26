import { jest } from '@jest/globals'
import { execSync } from 'child_process'
import generateMigration from '../src/commands/generateMigration'
import { input, select } from '@inquirer/prompts'

jest.mock('child_process', () => ({
	execSync: jest.fn()
}))

jest.mock('@inquirer/prompts', () => ({
	input: jest.fn(),
	select: jest.fn()
}))

describe('generateMigration Command', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('should generate a migration with the provided name', async () => {
		(input as jest.Mock).mockResolvedValueOnce('custom-migration-name')
		(select as jest.Mock).mockResolvedValueOnce('no')

		await generateMigration.parseAsync(['node', 'generate-migration'])

		expect(execSync).toHaveBeenCalledWith(
			expect.stringContaining(
				'typeorm migration:generate -n custom-migration-name'
			),
			expect.any(Object)
		)
	})

	it('should generate a migration with a random name if no name is provided', async () => {
		;(input as jest.Mock).mockResolvedValueOnce('')
		;(select as jest.Mock).mockResolvedValueOnce('no')

		await generateMigration.parseAsync(['node', 'generate-migration'])

		expect(execSync).toHaveBeenCalledWith(
			expect.stringContaining('typeorm migration:generate -n'),
			expect.any(Object)
		)

		// Check if the name contains a pattern (e.g., quick-fox-)
		const generatedName = execSync.mock.calls[0][0]
			.split('-n ')[1]
			.split(' ')[0]
		expect(generatedName).toMatch(/-[a-z]+-[a-z]+-\d+$/)
	})

	it('should run the migration after generation if selected', async () => {
		;(input as jest.Mock).mockResolvedValueOnce('run-after-migration')
		;(select as jest.Mock).mockResolvedValueOnce('yes')

		await generateMigration.parseAsync(['node', 'generate-migration'])

		expect(execSync).toHaveBeenCalledWith(
			expect.stringContaining('typeorm migration:run'),
			expect.any(Object)
		)
	})

	it('should not run the migration if not selected', async () => {
		;(input as jest.Mock).mockResolvedValueOnce('no-run-migration')
		;(select as jest.Mock).mockResolvedValueOnce('no')

		await generateMigration.parseAsync(['node', 'generate-migration'])

		expect(execSync).not.toHaveBeenCalledWith(
			expect.stringContaining('typeorm migration:run'),
			expect.any(Object)
		)
	})

	it('should handle errors gracefully', async () => {
		;(input as jest.Mock).mockResolvedValueOnce('error-migration')
		;(select as jest.Mock).mockResolvedValueOnce('no')
		;(execSync as jest.Mock).mockImplementationOnce(() => {
			throw new Error('Command failed')
		})

		const consoleErrorSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {})

		await generateMigration.parseAsync(['node', 'generate-migration'])

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Error generating migration:',
			'Command failed'
		)

		consoleErrorSpy.mockRestore()
	})
})
