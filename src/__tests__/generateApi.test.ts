import generateApi from '../commands/generateApi'
import { execSync } from 'child_process'

describe('generateApi Command', () => {
	it('should generate a new API file', () => {
		execSync('node dist/index.js generate-api testApi')
		const output = require('fs').readFileSync('dist/output/testApi.ts', 'utf-8')
		expect(output).toContain('testApi endpoint generated')
	})
})
