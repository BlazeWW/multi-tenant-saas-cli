import { Command } from 'commander'
import * as fs from 'fs-extra'
import * as path from 'path'
import { crudTemplate } from '../templates/crud'

const generateCrud = new Command('generate-crud')

generateCrud
	.description('Generate CRUD pages in Next.js for a given model')
	.argument('<model>', 'Name of the model (e.g., User, Product)')
	.action((model) => {
		const crud = crudTemplate(model)

		const outputPath = path.resolve(__dirname, `../output/${model}Crud.tsx`)
		fs.outputFileSync(outputPath, crud)

		console.log(`CRUD page for ${model} generated at ${outputPath}`)
	})

export default generateCrud
