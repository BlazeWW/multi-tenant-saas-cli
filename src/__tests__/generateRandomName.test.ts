import { generateRandomName } from '../functions'
import { adjectives, nouns } from '../lists'

describe('generateRandomName', () => {
	beforeAll(() => {
		// Mock Math.random to return a fixed value
		jest.spyOn(Math, 'random').mockReturnValue(0.5)

		// Mock Date.now to return a fixed timestamp
		jest.spyOn(Date, 'now').mockReturnValue(1682530475824)
	})

	afterAll(() => {
		jest.restoreAllMocks()
	})

	it('should generate a random name in the correct format', () => {
		const randomName = generateRandomName()

		// Since Math.random() is mocked to 0.5, it will select the middle item in the arrays
		const expectedAdjective = adjectives[Math.floor(adjectives.length / 2)]
		const expectedNoun = nouns[Math.floor(nouns.length / 2)]
		const expectedTimestamp = 1682530475824

		const expectedName = `${expectedAdjective}-${expectedNoun}-${expectedTimestamp}`
		expect(randomName).toBe(expectedName)
	})

	it('should include an adjective, a noun, and a timestamp', () => {
		const randomName = generateRandomName()
		const parts = randomName.split('-')

		expect(parts.length).toBe(3)
		expect(adjectives).toContain(parts[0])
		expect(nouns).toContain(parts[1])
		expect(parts[2]).toMatch(/^\d+$/)
	})
})
