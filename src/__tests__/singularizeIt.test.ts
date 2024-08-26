import { singularizeIt } from '../functions'

describe('singularizeIt', () => {
	it('should singularize plural words', () => {
		expect(singularizeIt('cars')).toBe('car')
		expect(singularizeIt('people')).toBe('person')
		expect(singularizeIt('children')).toBe('child')
	})

	it('should return the word unchanged if it is already singular', () => {
		expect(singularizeIt('car')).toBe('car')
		expect(singularizeIt('person')).toBe('person')
		expect(singularizeIt('child')).toBe('child')
	})
})
