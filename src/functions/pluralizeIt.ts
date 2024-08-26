import pluralize from 'pluralize'

export const pluralizeIt = (name: string) => {
	return pluralize.isSingular(name) ? pluralize.plural(name) : name
}
