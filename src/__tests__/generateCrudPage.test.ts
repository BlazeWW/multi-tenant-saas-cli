import { execSync } from 'child_process'
import * as fs from 'fs-extra'
import * as path from 'path'

describe('generateCrud Command', () => {
	const outputPath = path.resolve(__dirname, '../output/ProductCrud.tsx')

	afterEach(() => {
		// Clean up generated files after each test
		if (fs.existsSync(outputPath)) {
			fs.removeSync(outputPath)
		}
	})

	it('should generate a basic CRUD page for a given model', () => {
		execSync('node dist/index.js generate-crud Product')
		const output = fs.readFileSync(outputPath, 'utf-8')
		expect(output).toContain('export default function ProductCrud()')
		expect(output).toContain('<h1>Product Management</h1>')
	})

	it('should include API calls in the generated CRUD page', () => {
		execSync('node dist/index.js generate-crud Product')
		const output = fs.readFileSync(outputPath, 'utf-8')
		expect(output).toContain("await axios.get('/api/product')")
		expect(output).toContain("await axios.post('/api/product'")
		expect(output).toContain('await axios.put(`/api/product/`')
		expect(output).toContain('await axios.delete(`/api/product/`')
	})
})
