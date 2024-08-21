import { Command } from 'commander'
import * as fs from 'fs-extra'
import * as path from 'path'
import { input, select, confirm } from '@inquirer/prompts'

const generateModel = new Command()

generateModel
	.command('generate-model')
	.description('Generate a TypeORM entity model and save schema to JSON')
	.argument('[name]', 'Name of the model (e.g., User, Product)')
	.action(async (name) => {
		// Prompt for the name if it isn't provided
		if (!name) {
			name = await input({
				message: 'Please enter the name of the model:',
				validate: (input) => (input ? true : 'Model name cannot be empty')
			})
		}

		const entityName = name.charAt(0).toUpperCase() + name.slice(1)
		let fieldsTemplate = ''
		const fields: { name: string; type: string }[] = []
		let addMoreFields = true

		// Loop to gather fields
		while (addMoreFields) {
			const fieldName = await input({
				message: 'Enter field name (leave blank to finish):'
			})

			if (!fieldName) {
				addMoreFields = false
				break
			}

			const fieldType = await select({
				message: `Select the type for ${fieldName}:`,
				choices: [
					{ name: 'String', value: 'string' },
					{ name: 'Number', value: 'number' },
					{ name: 'Boolean', value: 'boolean' },
					{ name: 'Date', value: 'Date' },
					{ name: 'Text', value: 'text' }
				]
			})

			fieldsTemplate += `  @Column()\n  ${fieldName}: ${fieldType};\n\n`
			fields.push({ name: fieldName, type: fieldType })
		}

		const entityTemplate = `
    import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

    @Entity()
    export class ${entityName} {
      @PrimaryGeneratedColumn()
      id: number;

      ${fieldsTemplate}
    }
    `

		const outputPath = path.resolve(__dirname, `../entity/${entityName}.ts`)
		fs.outputFileSync(outputPath, entityTemplate)

		// Save schema to JSON
		const schemaPath = path.resolve(__dirname, `../schemas/${entityName}.json`)
		fs.outputJsonSync(schemaPath, { name: entityName, fields })

		console.log(`Entity model ${entityName} generated at ${outputPath}`)
		console.log(`Schema saved to ${schemaPath}`)
	})

export default generateModel
