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
import { input } from '@inquirer/prompts'

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
			singleItemApiTemplate += dbName
			listApiTemplate += dbNameList
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
