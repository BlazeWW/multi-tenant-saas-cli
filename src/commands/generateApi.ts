import { Command } from 'commander'
import * as fs from 'fs-extra'
import * as path from 'path'
import { authAwsCognito, dbName, dbNameList } from '../templates/api'

const generateApi = new Command()

generateApi
	.command('generate-api')
	.description('Generate AWS API endpoints with optional features')
	.argument('<name>', 'Name of the API')
	.option('-a, --auth', 'Include AWS Cognito authentication')
	.option('-d, --db', 'Integrate with PostgreSQL database')
	.action((name, options) => {
		// Single item GET endpoint
		let singleItemApiTemplate = `export const get${name} = async (event) => {
      // Get single ${name.toLowerCase()} logic here`

		if (options.auth) {
			singleItemApiTemplate += authAwsCognito
		}

		if (options.db) {
			singleItemApiTemplate += dbName
		}

		singleItemApiTemplate += `
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Single ${name.toLowerCase()} fetched", data }),
      };
    };`

		// List GET endpoint
		let listApiTemplate = `export const list${name}s = async (event) => {
      // Get list of ${name.toLowerCase()}s logic here`

		if (options.auth) {
			listApiTemplate += authAwsCognito
		}

		if (options.db) {
			listApiTemplate += dbNameList
		}

		listApiTemplate += `
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "List of ${name.toLowerCase()}s fetched", data }),
      };
    };`

		// Functions for auth and DB interaction if selected
		let additionalFunctions = ''

		// Combine all templates
		const apiTemplate = `${singleItemApiTemplate}\n\n${listApiTemplate}\n\n${additionalFunctions}`

		const outputPath = path.resolve(__dirname, `../output/${name}.ts`)
		fs.outputFileSync(outputPath, apiTemplate)

		console.log(`API endpoints for ${name} generated at ${outputPath}`)
	})

export default generateApi
