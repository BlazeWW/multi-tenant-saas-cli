import { Command } from 'commander'
import * as fs from 'fs-extra'
import * as path from 'path'

const generateApi = new Command('generate-api') // Set the name of the command here

generateApi
	.description('Generate an AWS API endpoint')
	.argument('<name>', 'Name of the API')
	.action((name) => {
		const apiTemplate = `export const ${name} = async (event) => {
      // Your API logic here
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "${name} endpoint generated" }),
      };
    };`

		const outputPath = path.resolve(__dirname, `../output/${name}.ts`)
		fs.outputFileSync(outputPath, apiTemplate)

		console.log(`API endpoint ${name} generated at ${outputPath}`)
	})

export default generateApi
