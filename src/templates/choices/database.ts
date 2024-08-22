import { Separator } from '@inquirer/prompts'
export const databaseChoices = [
	{
		name: 'string',
		value: 'string',
		description: 'A textual data type'
	},
	{
		name: 'number',
		value: 'number',
		description: 'A numeric data type'
	},
	{
		name: 'boolean',
		value: 'boolean',
		description: 'A true/false data type'
	},
	{
		name: 'date',
		value: 'date',
		description: 'A date/time data type'
	},
	new Separator(),
	{
		name: 'json',
		value: 'json',
		description: 'A JSON data type'
	},
	{
		name: 'uuid',
		value: 'uuid',
		description: 'A universally unique identifier (UUID)'
	}
]
