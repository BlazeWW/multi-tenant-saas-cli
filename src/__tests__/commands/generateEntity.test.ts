import { execSync } from 'node:child_process'
import * as fs from 'fs-extra'
import * as path from 'path'

describe('generateEntity Command', () => {
	const entityName = 'TestEntity'
	const outputDir = path.resolve(__dirname, '../src/output')
	const outputPath = path.resolve(outputDir, `${entityName}.ts`)

	afterEach(() => {
		// Clean up generated files after each test
		if (fs.existsSync(outputPath)) {
			fs.removeSync(outputPath)
		}
	})

	it('should generate a basic entity file with a string field', () => {
		execSync(`node dist/index.js generate-entity`, {
			input: `${entityName}\n${outputDir}\nname\nstring\n\n255\nyes\nno\nno\n\nno\n`
		})

		const output = fs.readFileSync(outputPath, 'utf-8')
		expect(output).toContain(`export class ${entityName}`)
		expect(output).toContain(`@Column({length: 255, nullable: true})`)
		expect(output).toContain(`name: string;`)
	})

	it('should generate an entity file with a one-to-one relationship', () => {
		execSync(`node dist/index.js generate-entity`, {
			input: `${entityName}\n${outputDir}\nrelatedEntity\none-to-one\nRelatedEntity\n\nno\nno\nno\n\nno\n`
		})

		const output = fs.readFileSync(outputPath, 'utf-8')
		expect(output).toContain(`@OneToOne(() => RelatedEntity)`)
		expect(output).toContain(`@JoinColumn()`)
		expect(output).toContain(`relatedEntity: RelatedEntity;`)
	})

	it('should generate an entity file with a default value', () => {
		execSync(`node dist/index.js generate-entity`, {
			input: `${entityName}\n${outputDir}\nstatus\nstring\n\n255\nyes\nno\nno\nactive\nno\n`
		})

		const output = fs.readFileSync(outputPath, 'utf-8')
		expect(output).toContain(
			`@Column({length: 255, nullable: true, default: 'active'})`
		)
		expect(output).toContain(`status: string;`)
	})

	it('should generate an entity file with unique and indexed fields', () => {
		execSync(`node dist/index.js generate-entity`, {
			input: `${entityName}\n${outputDir}\nemail\nstring\n\n255\nyes\nyes\nyes\n\nno\n`
		})

		const output = fs.readFileSync(outputPath, 'utf-8')
		expect(output).toContain(
			`@Column({length: 255, nullable: true, unique: true, index: true})`
		)
		expect(output).toContain(`email: string;`)
	})
})
