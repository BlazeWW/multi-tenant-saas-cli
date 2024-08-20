import { Command } from 'commander'
import * as fs from 'fs-extra'
import * as path from 'path'
import { input, rawlist } from '@inquirer/prompts'

const generateModel = new Command()

generateModel
	.command('generate-model')
	.description('Generate a TypeORM entity model')
	.argument('[name]', 'Name of the model (e.g., User, Product)')
	.argument(
		'[fields...]',
		'Fields of the model in the format fieldName:fieldType'
	)
	.action(async (name, fields) => {
		// Prompt for the name if it isn't provided
		if (!name) {
			name = await input({
				message: 'Please enter the name of the model:',
				validate: (input: string) =>
					input ? true : 'The Model name cannot be empty'
			})
		}
		if (!fields) {
			fields = await rawlist({
				message: 'Please enter the fields of the model:'
			})
		}

		const entityName = name.charAt(0).toUpperCase() + name.slice(1)
		let fieldsTemplate = ''

		for (const field of fields) {
			const [fieldName, fieldType] = field.split(':')
			fieldsTemplate += `  @Column()\n  ${fieldName}: ${fieldType};\n\n`
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

		console.log(`Entity model ${entityName} generated at ${outputPath}`)
	})

export default generateModel
