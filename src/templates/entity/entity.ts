interface FieldList {
	fieldName: string
	fieldType: string
	relatedEntity?: string
	nullable?: string
	length?: number
	unique?: boolean
	default?: string | number | boolean | null
	index?: boolean
}

export const entityTemplate = (entityName: string, fields: FieldList[]) => {
	const importsSet = new Set<string>()
	importsSet.add('Entity') // Always needed
	importsSet.add('PrimaryGeneratedColumn') // Always needed
	importsSet.add('Column') // Default case

	let entityTemplate = `\n@Entity()\nexport class ${entityName} {\n  @PrimaryGeneratedColumn()\n  id: number;\n`

	fields.forEach(({ fieldName, fieldType }) => {
		switch (fieldType) {
			case 'one-to-one':
				importsSet.add('OneToOne')
				importsSet.add('JoinColumn')
				entityTemplate += `
  @OneToOne(() => ${fieldName})
  @JoinColumn()
  ${fieldName}: ${fieldName};\n`
				break
			case 'one-to-many':
				importsSet.add('OneToMany')
				entityTemplate += `
  @OneToMany(() => ${fieldName}, ${fieldName.toLowerCase()} => ${fieldName.toLowerCase()}.${entityName.toLowerCase()})
  ${fieldName.toLowerCase()}s: ${fieldName}[];\n`
				break
			case 'many-to-many':
				importsSet.add('ManyToMany')
				importsSet.add('JoinTable')
				entityTemplate += `
  @ManyToMany(() => ${fieldName})
  @JoinTable()
  ${fieldName.toLowerCase()}s: ${fieldName}[];\n`
				break
			default:
				entityTemplate += `
  @Column()
  ${fieldName}: ${fieldType};\n`
		}
	})

	entityTemplate += '\n}'

	// Construct the import statement based on the used decorators
	const importStatement = `import { ${[...importsSet].join(
		', '
	)} } from 'typeorm';\n`

	return importStatement + entityTemplate
}
