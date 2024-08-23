import { adjectives, nouns } from '../lists'

export const generateRandomName = (): string => {
	const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
	const noun = nouns[Math.floor(Math.random() * nouns.length)]
	const timestamp = Date.now()
	return `${adjective}-${noun}-${timestamp}`
}
