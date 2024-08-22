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
	let entityTemplate = `
   import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm';

  @Entity()
  export class ${entityName} {
    @PrimaryGeneratedColumn()
    id: number;\n`

	fields.map(
		({
			fieldName,
			fieldType,
			relatedEntity,
			nullable,
			length,
			unique,
			default: defaultValue,
			index
		}) => {
			const columnOptions = []
			if (length) columnOptions.push(`length: ${length}`)
			if (nullable === 'Yes') columnOptions.push('nullable: true')
			if (nullable === 'No') columnOptions.push('nullable: false')
			if (unique) columnOptions.push('unique: true')
			if (index) columnOptions.push('index: true')
			if (defaultValue !== undefined)
				columnOptions.push(
					`default: ${
						typeof defaultValue === 'string'
							? `'${defaultValue}'`
							: defaultValue
					}`
				)

			switch (fieldType) {
				case 'one-to-one':
					entityTemplate += `
    @OneToOne(() => ${relatedEntity})
    @JoinColumn()
    ${fieldName}: ${relatedEntity};\n`
					break
				case 'one-to-many':
					entityTemplate += `
    @OneToMany(() => ${relatedEntity}, ${relatedEntity?.toLowerCase()} => ${relatedEntity?.toLowerCase()}.${entityName.toLowerCase()})
    ${relatedEntity?.toLowerCase()}s: ${relatedEntity}[];\n`
					break
				case 'many-to-many':
					entityTemplate += `
    @ManyToMany(() => ${relatedEntity})
    @JoinTable()
    ${relatedEntity?.toLowerCase()}s: ${relatedEntity}[];\n`
					break
				default:
					entityTemplate += `
    @Column({${columnOptions.join(', ')}})
    ${fieldName}: ${fieldType};\n`
			}
		}
	)

	entityTemplate += '\n}'

	return entityTemplate
}
