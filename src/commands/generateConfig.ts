import { Command } from 'commander'
import fs from 'fs-extra'
import path from 'path'
import { input, select } from '@inquirer/prompts'
import {
	apiFrameworksChoices,
	databaseChoices,
	yesNoChoices
} from '../templates/choices'

const generateConfig = new Command('generate-config')
	.description('Generate a JSON configuration file for the project')
	.action(async () => {
		const name = await input({
			message: 'What is the name of your project?',
			validate: (input) => (input ? true : 'Name cannot be empty')
		})

		const database = await select({
			message: 'Select field type:',
			choices: databaseChoices
		})

		const useAuth = await select({
			message: 'Would you like to use authentication?',
			choices: yesNoChoices
		})
		let auth = 'postgreSQL'
		if (useAuth === 'yes') {
			auth = await select({
				message: 'Which authentication method will you use?',
				choices: databaseChoices
			})
		}

		const apiFramework = await select({
			message: 'Which framework will you use for the API?',
			choices: apiFrameworksChoices,
			default: 'lambda'
		})

		const generateCRUD = await select({
			message: 'Do you want to generate CRUD pages?',
			choices: yesNoChoices,
			default: 'yes'
		})

		const generateGraphReports = await select({
			message: 'Do you want to generate graph reports?',
			choices: yesNoChoices,
			default: 'yes'
		})

		const config = {
			projectName: name,
			database: database,
			auth: useAuth === 'yes' ? auth : '',
			apiFramework: apiFramework,
			generateCRUD: generateCRUD,
			generateGraphReports: generateGraphReports
		}

		const configPath = path.join(process.cwd(), `${name}-config.json`)
		await fs.writeJson(configPath, config, { spaces: 2 })

		console.log(`Configuration file generated at ${configPath}`)
	})

export default generateConfig
