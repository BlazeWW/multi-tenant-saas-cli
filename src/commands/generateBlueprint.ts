import { Command } from 'commander'
import fs from 'node:fs'
import path from 'path'

const program = new Command()

program
	.command('generate-blueprint')
	.description('Generate a JSON blueprint for the project')
	.option('-o, --output <path>', 'Output file path', './blueprint.json')
	.option('--db-schema-file <file>', 'Path to the database schema JSON file')
	.option(
		'--auth-provider <provider>',
		'Authentication provider (e.g., AWS Cognito)',
		'AWS Cognito'
	)
	.action((options) => {
		if (!options.dbSchemaFile) {
			console.error('Database schema file is required')
			process.exit(1)
		}

		// Read and parse the JSON schema file
		const dbSchemaPath = path.resolve(options.dbSchemaFile)
		let dbSchema
		try {
			const dbSchemaData = fs.readFileSync(dbSchemaPath, 'utf-8')
			dbSchema = JSON.parse(dbSchemaData)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			console.error(
				'Error reading or parsing the database schema file:',
				error.message
			)
			process.exit(1)
		}

		// Automatically generate API, CRUD, and graph configurations based on db-schema
		const apiEndpoints = {}
		const crudOperations = {}
		const graphReports: {
			type: string
			data: {
				labels: string[]
				datasets: {
					label: string
					data: number[] // Placeholder, will be filled during actual report generation
				}[]
			}
		}[] = []

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		dbSchema.tables.map((table: any) => {
			const tableName = table.name

			// Generate API endpoints
			apiEndpoints[tableName] = {
				GET: `/${tableName}`,
				POST: `/${tableName}`,
				PUT: `/${tableName}/:id`,
				DELETE: `/${tableName}/:id`
			}

			// Generate CRUD operations
			crudOperations[tableName] = [
				'create',
				'getList',
				'getId',
				'update',
				'delete'
			]

			// Generate default graph reports (example: bar chart for counts)
			graphReports.push({
				type: 'bar',
				data: {
					labels: [`${tableName} Data`],
					datasets: [
						{
							label: `${tableName} Count`,
							data: [0] // Placeholder, will be filled during actual report generation
						}
					]
				}
			})
		})

		const blueprint = {
			database: {
				type: 'DrizzleORM',
				driver: 'drizzle-orm',
				extensions: ['drizzle-zod', 'drizzle-graphql'],
				schema: dbSchema
			},
			auth: {
				provider: options.authProvider
			},
			api: {
				type: 'REST/GraphQL',
				websockets: true,
				integration: 'AWS Lambda + API Gateway',
				endpoints: apiEndpoints
			},
			crud: crudOperations,
			reports: {
				graphs: graphReports,
				export: ['Excel', 'PDF']
			}
		}

		const outputPath = path.resolve(options.output)
		fs.writeFileSync(outputPath, JSON.stringify(blueprint, null, 2))

		console.log(`Blueprint generated at ${outputPath}`)
	})

export default program
