// src/commands/generateEntity.ts
import { Command } from 'commander'
import * as fs from 'fs-extra'
import * as path from 'path'
import { input, select } from '@inquirer/prompts'
import { databaseChoices, yesNoChoices } from '../templates/choices'
import { entityTemplate } from '../templates/entity'

const generateEntity = new Command('generate-entity')

generateEntity
	.description('Generate a TypeORM entity')
	.action(async () => {
		const entityName = await input({
			message: 'Please enter the name of the entity:',
			validate: (input) => (input ? true : 'Entity name cannot be empty')
		})

		const fields = []
		let addMoreFields = true

		while (addMoreFields) {
			const fieldName = await input({
				message: 'Enter field name (or related entity name for relationships):',
				validate: (input) => (input ? true : 'Field name cannot be empty')
			})

			const fieldType = await select({
				message: 'Select field type:',
				choices: databaseChoices
			})

			fields.push({ fieldName, fieldType })

			addMoreFields =
				(await select({
					message: 'Add another field or relationship?',
					choices: yesNoChoices
				})) === 'yes'
		}

		const entity = entityTemplate(entityName, fields)

		const outputPath = path.resolve(__dirname, `../output/${entityName}.ts`)
		fs.outputFileSync(outputPath, entity)

		console.log(`Entity ${entityName} generated at ${outputPath}`)
	})

export default generateEntity
