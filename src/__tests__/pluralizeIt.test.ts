import { pluralizeIt } from '../functions'

describe('pluralizeIt', () => {
	it('should pluralize singular words', () => {
		expect(pluralizeIt('car')).toBe('cars')
		expect(pluralizeIt('person')).toBe('people')
		expect(pluralizeIt('child')).toBe('children')
	})

	it('should return the word unchanged if it is already plural', () => {
		expect(pluralizeIt('cars')).toBe('cars')
		expect(pluralizeIt('people')).toBe('people')
		expect(pluralizeIt('children')).toBe('children')
	})
})
