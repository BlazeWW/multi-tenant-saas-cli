import { Command } from 'commander'
import generateApi from './commands/generateApi'
import generateCrudPage from './commands/generateCrudPage'
import generateModel from './commands/generateModel'
import generateEntity from './commands/generateEntity'
import generateConfig from './commands/generateConfig'

const program = new Command()

program
	.name('multi-tenant-saas-cli')
	.description('CLI for generating multi-tenant SaaS platform components')
	.version('0.1.0')

program.addCommand(generateConfig)
program.addCommand(generateApi)
program.addCommand(generateCrudPage)
program.addCommand(generateModel)
program.addCommand(generateEntity)

program.parse(process.argv)
