interface FieldList {
	fieldName: string,
	fieldType: string
}
export const entityTemplate = (
	entityName: string,
	fieldList?: FieldList[]
) => `import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

    @Entity()
    export class ${entityName} {
      @PrimaryGeneratedColumn()
      id: number;
			${fieldList?.length?{for(let i =0;i<fieldList.length;i++){
				`@Column()
				${fieldList[i].fieldName}: ${fieldList[i].fieldType};
				`
			}}:''}
			}`

		// fieldList.forEach(({ fieldName, fieldType }) => {
		// 	`@Column()
		//			${fieldName}: ${fieldType};`
		// })