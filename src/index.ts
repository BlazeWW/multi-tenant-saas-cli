import { Command } from 'commander'
import generateApi from './commands/generateApi'
import generateCrudPage from './commands/generateCrudPage'
import generateModel from './commands/generateModel'

const program = new Command()

program
	.name('multi-tenant-saas-cli')
	.description('CLI for generating multi-tenant SaaS platform components')
	.version('0.1.0')

program.addCommand(generateApi).name('generate-api')
program.addCommand(generateCrudPage).name('generate-crud')
program.addCommand(generateModel).name('generate-model')

program.parse(process.argv)
