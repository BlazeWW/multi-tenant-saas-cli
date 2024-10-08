import { Command } from 'commander'
import * as child_process from 'node:child_process'
import { input, select } from '@inquirer/prompts'
import * as path from 'path'
import { yesNoChoices } from '../templates/choices'
import { generateRandomName } from '../functions'

const generateMigration = new Command('generate-migration')

generateMigration
	.description(
		'Generate a TypeORM migration script based on the current entities'
	)
	.action(async () => {
		let migrationName = await input({
			message: 'Enter a name for the migration (leave empty for random name):'
		})

		if (!migrationName) {
			migrationName = generateRandomName()
			console.log(`No name provided. Using generated name: ${migrationName}`)
		}

		const runAfterGeneration = await select({
			message: 'Do you want to run the migration immediately after generation?',
			choices: yesNoChoices
		})

		const migrationDir = path.resolve(__dirname, '../migration')
		const command = `typeorm migration:generate -n ${migrationName} -d ${migrationDir}`

		try {
			console.log('Generating migration...')
			child_process.execSync(command, { stdio: 'inherit' })
			console.log('Migration generated successfully.')

			if (runAfterGeneration === 'yes') {
				console.log('Running migration...')
				child_process.execSync('typeorm migration:run', { stdio: 'inherit' })
				console.log('Migration run successfully.')
			}
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			console.error('Error generating migration:', error.message)
		}
	})

export default generateMigration
