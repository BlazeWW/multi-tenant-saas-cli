import pluralize from 'pluralize'

export const singularizeIt = (name: string) => {
	return pluralize.isPlural(name) ? pluralize.singular(name) : name
}
