import { execSync } from 'node:child_process'
import * as fs from 'fs-extra'
import * as path from 'path'

describe('generateConfig Command', () => {
	const configName = 'testProject'
	const configPath = path.resolve(process.cwd(), `${configName}-config.json`)

	afterEach(() => {
		// Clean up generated files after each test
		if (fs.existsSync(configPath)) {
			fs.removeSync(configPath)
		}
	})

	it('should generate a configuration file with basic settings', () => {
		execSync(`node dist/index.js generate-config`, {
			input: `${configName}\nPostgreSQL\nyes\nAWS Cognito\nlambda\nyes\nyes\n`
		})

		const config = fs.readJsonSync(configPath)
		expect(config.projectName).toBe(configName)
		expect(config.database).toBe('PostgreSQL')
		expect(config.auth).toBe('AWS Cognito')
		expect(config.apiFramework).toBe('lambda')
		expect(config.generateCRUD).toBe('yes')
		expect(config.generateGraphReports).toBe('yes')
	})

	it('should generate a configuration file with no authentication', () => {
		execSync(`node dist/index.js generate-config`, {
			input: `${configName}\nPostgreSQL\nno\nlambda\nyes\nyes\n`
		})

		const config = fs.readJsonSync(configPath)
		expect(config.projectName).toBe(configName)
		expect(config.database).toBe('PostgreSQL')
		expect(config.auth).toBe('')
		expect(config.apiFramework).toBe('lambda')
		expect(config.generateCRUD).toBe('yes')
		expect(config.generateGraphReports).toBe('yes')
	})

	it('should generate a configuration file with MySQL and no graph reports', () => {
		execSync(`node dist/index.js generate-config`, {
			input: `${configName}\nMySQL\nyes\nOAuth2\nexpress\nyes\nno\n`
		})

		const config = fs.readJsonSync(configPath)
		expect(config.projectName).toBe(configName)
		expect(config.database).toBe('MySQL')
		expect(config.auth).toBe('OAuth2')
		expect(config.apiFramework).toBe('express')
		expect(config.generateCRUD).toBe('yes')
		expect(config.generateGraphReports).toBe('no')
	})

	it('should handle an empty project name by generating a random name', () => {
		const output = execSync(`node dist/index.js generate-config`, {
			input: `\nPostgreSQL\nyes\nAWS Cognito\nlambda\nyes\nyes\n`
		}).toString()

		const generatedFileName = output.match(
			/Configuration file generated at .*\/(.*)-config\.json/
		)[1]
		const configFilePath = path.resolve(
			process.cwd(),
			`${generatedFileName}-config.json`
		)

		const config = fs.readJsonSync(configFilePath)
		expect(config.projectName).toBe(generatedFileName)
		expect(config.database).toBe('PostgreSQL')
		expect(config.auth).toBe('AWS Cognito')
		expect(config.apiFramework).toBe('lambda')
		expect(config.generateCRUD).toBe('yes')
		expect(config.generateGraphReports).toBe('yes')

		// Clean up the generated file
		fs.removeSync(configFilePath)
	})
})
