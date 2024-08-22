import { Command } from 'commander'
import * as fs from 'fs-extra'
import * as path from 'path'
import {
	authAwsCognito,
	dbName,
	dbNameList,
	apiTemplateSingle,
	apiTemplateList,
	apiTemplateCreate,
	apiTemplateUpdate,
	apiTemplateDelete
} from '../templates/api'
import { input, select } from '@inquirer/prompts'
import { yesNoAuthChoices, yesNoPostgresChoices } from '../templates/choices'

const generateApi = new Command('generate-api')

generateApi
	.description('Generate AWS API endpoints with optional features')
	.option('-a, --auth', 'Include AWS Cognito authentication')
	.option('-d, --db', 'Integrate with PostgreSQL database')
	.action(async (options) => {
		// Prompt for the name if it isn't provided
		const name = await input({
			message: 'Please enter the name of the API:',
			validate: (input) => (input ? true : 'API name cannot be empty')
		})

		// Check if the user provided the --auth option, otherwise prompt them
		let includeAuth = options.auth
		if (!includeAuth) {
			includeAuth = await select({
				message: 'Would you like to include AWS Cognito authentication?',
				choices: yesNoAuthChoices
			})
		}

		// Check if the user provided the --db option, otherwise prompt them
		let includeDb = options.db
		if (!includeDb) {
			includeDb = await select({
				message: 'Would you like to integrate with PostgreSQL database?',
				choices: yesNoPostgresChoices
			})
		}

		// Set CRUD operations Templates
		let singleItemApiTemplate = apiTemplateSingle(name)
		let listApiTemplate = apiTemplateList(name)
		let createApiTemplate = apiTemplateCreate(name)
		let updateApiTemplate = apiTemplateUpdate(name)
		let deleteApiTemplate = apiTemplateDelete(name)

		if (options.auth) {
			singleItemApiTemplate += authAwsCognito
			listApiTemplate += authAwsCognito
			createApiTemplate += authAwsCognito
			updateApiTemplate += authAwsCognito
			deleteApiTemplate += authAwsCognito
		}

		if (options.db) {
			singleItemApiTemplate += dbName(name)
			listApiTemplate += dbNameList(name)
			// The Create, Update, and Delete templates already assume DB interaction, so no additional snippets needed
		}

		// Combine all templates
		const apiTemplate = `
    ${singleItemApiTemplate}

    ${listApiTemplate}

    ${createApiTemplate}

    ${updateApiTemplate}

    ${deleteApiTemplate}
    `

		const outputPath = path.resolve(__dirname, `../output/${name}.ts`)
		fs.outputFileSync(outputPath, apiTemplate)

		console.log(`API endpoints for ${name} generated at ${outputPath}`)
	})

export default generateApi
