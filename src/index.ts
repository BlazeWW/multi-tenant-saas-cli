import { Command } from 'commander'
import generateApi from './commands/generateApi'

const program = new Command()

program
	.name('multi-tenant-saas-cli')
	.description('CLI for generating multi-tenant SaaS platform components')
	.version('0.1.0')

program.addCommand(generateApi)

program.parse(process.argv)
