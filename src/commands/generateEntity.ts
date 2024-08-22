import { Command } from 'commander'
import * as fs from 'fs-extra'
import * as path from 'path'
import { input, select } from '@inquirer/prompts'
import { databaseTypesChoices, yesNoChoices } from '../templates/choices'
import { entityTemplate } from '../templates/entity'

const generateEntity = new Command('generate-entity')

generateEntity.description('Generate a TypeORM entity').action(async () => {
	const entityName = await input({
		message: 'Please enter the name of the entity:',
		validate: (input) => (input ? true : 'Entity name cannot be empty')
	})
	const outputDir = await input({
		message: 'Specify the output directory (default: src/output):',
		default: 'src/output'
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
			choices: databaseTypesChoices
		})

		let relatedEntity = ''
		// Check if the field type is a relationship and prompt for related entity
		if (['one-to-one', 'one-to-many', 'many-to-many'].includes(fieldType)) {
			relatedEntity = await input({
				message: `Enter the related entity for ${fieldType} relationship:`,
				validate: (input) =>
					input ? true : 'Related entity name cannot be empty'
			})

			const relatedEntityPath = path.resolve(
				__dirname,
				`${outputDir}/${relatedEntity}.ts`
			)
			if (!fs.existsSync(relatedEntityPath)) {
				console.warn(
					`Warning: Related entity file ${relatedEntity}.ts does not exist. You may need to generate it first.`
				)
			}
		}

		let length = undefined
		if (fieldType === 'string') {
			length = await input({
				message: 'Enter the length of the string field (default: 255):',
				default: '255',
				validate: (input) =>
					!Number.isNaN(Number(input)) || 'Length must be a number'
			})
		}

		const nullable = await select({
			message: 'Is the field nullable?:',
			choices: yesNoChoices,
			default: 'yes'
		})

		const unique =
			(await select({
				message: 'Is the field unique?',
				choices: yesNoChoices,
				default: 'no'
			})) === 'yes'

		const index =
			(await select({
				message: 'Is the field indexed?',
				choices: yesNoChoices,
				default: 'no'
			})) === 'yes'

		const defaultValue = await input({
			message: 'Enter the default value (leave empty if none):',
			validate: (input) => true // Allow empty input
		})

		fields.push({
			fieldName,
			fieldType,
			relatedEntity,
			nullable,
			length: length ? Number(length) : undefined,
			unique,
			index,
			default: defaultValue || undefined
		})

		addMoreFields =
			(await select({
				message: 'Add another field or relationship?',
				choices: yesNoChoices
			})) === 'yes'
	}

	const entity = entityTemplate(entityName, fields)

	const outputPath = path.resolve(outputDir, `${entityName}.ts`)

	try {
		fs.outputFileSync(outputPath, entity)
		console.log(`Entity ${entityName} generated at ${outputPath}`)
		console.log('Summary of Generated Fields:')
		fields.map(
			({
				fieldName,
				fieldType,
				relatedEntity,
				nullable,
				unique,
				index,
				default: defaultValue
			}) => {
				console.log(
					`- ${fieldName}: ${fieldType}${
						relatedEntity ? ` (related to ${relatedEntity})` : ''
					}, nullable: ${nullable}, unique: ${unique}, index: ${index}, default: ${defaultValue}`
				)
			}
		)
		console.log('Next Steps:')
		console.log("- if you're ready to migrate: $ pnpm gen:migrate")
		console.log("- if you're ready to generate an API: $ pnpm gen:api")
		console.log('- Want another Entity? $ pnpm gen:entity')
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.error(`Failed to generate entity: ${error.message}`)
	}
})

export default generateEntity
