interface FieldList {
	fieldName: string
	fieldType: string
}

export const entityTemplate = (entityName: string, fields: FieldList[]) => {
	let entityTemplate = `
	import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm';

	@Entity()
	export class ${entityName} {
  @PrimaryGeneratedColumn()
  id: number;\n`

	fields.map(({ fieldName, fieldType }) => {
		switch (fieldType) {
			case 'one-to-one':
				entityTemplate += `
  @OneToOne(() => ${fieldName})
  @JoinColumn()
  ${fieldName}: ${fieldName};\n`
				break
			case 'one-to-many':
				entityTemplate += `
  @OneToMany(() => ${fieldName}, ${fieldName.toLowerCase()} => ${fieldName.toLowerCase()}.${entityName.toLowerCase()})
  ${fieldName.toLowerCase()}s: ${fieldName}[];\n`
				break
			case 'many-to-many':
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

	entityTemplate += "\n}"

	return entityTemplate
}
