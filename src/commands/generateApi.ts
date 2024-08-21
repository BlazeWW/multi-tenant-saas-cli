import { Command } from 'commander'
import * as fs from 'fs-extra'
import * as path from 'path'
import { authAwsCognito } from '../templates/api'

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
			singleItemApiTemplate += `
      // Database interaction to get a single ${name.toLowerCase()}
      const data = await fetchDataFromDB(event.pathParameters.id);`
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
			listApiTemplate += `
      // Database interaction to get list of ${name.toLowerCase()}s
      const data = await fetchDataListFromDB();`
		}

		listApiTemplate += `
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "List of ${name.toLowerCase()}s fetched", data }),
      };
    };`

		// Functions for auth and DB interaction if selected
		let additionalFunctions = ''

		

		if (options.db) {
			additionalFunctions += `
    // Function to interact with PostgreSQL database for a single item
    const fetchDataFromDB = async (id) => {
      // Implement database logic here to fetch a single ${name.toLowerCase()}
    };

    // Function to interact with PostgreSQL database for a list of items
    const fetchDataListFromDB = async () => {
      // Implement database logic here to fetch list of ${name.toLowerCase()}s
    };`
		}

		// Combine all templates
		const apiTemplate = `${singleItemApiTemplate}\n\n${listApiTemplate}\n\n${additionalFunctions}`

		const outputPath = path.resolve(__dirname, `../output/${name}.ts`)
		fs.outputFileSync(outputPath, apiTemplate)

		console.log(`API endpoints for ${name} generated at ${outputPath}`)
	})

export default generateApi
