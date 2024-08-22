import { Command } from 'commander'
import * as fs from 'fs-extra'
import * as path from 'path'

const generateCrud = new Command('generate-crud')

generateCrud
	.description('Generate CRUD pages in Next.js for a given model')
	.argument('<model>', 'Name of the model (e.g., User, Product)')
	.action((model) => {
		const modelLowerCase = model.toLowerCase()
		const crudTemplate = `
    import { useState } from 'react';
    import axios from 'axios';

    export default function ${model}Crud() {
      const [data, setData] = useState([]);

      // Fetch data from API
      const fetchData = async () => {
        const response = await axios.get('/api/${modelLowerCase}');
        setData(response.data);
      };

      // Handle Create
      const handleCreate = async (newItem) => {
        await axios.post('/api/${modelLowerCase}', newItem);
        fetchData();
      };

      // Handle Update
      const handleUpdate = async (id, updatedItem) => {
        await axios.put(\`/api/${modelLowerCase}/\${id}\`, updatedItem);
        fetchData();
      };

      // Handle Delete
      const handleDelete = async (id) => {
        await axios.delete(\`/api/${modelLowerCase}/\${id}\`);
        fetchData();
      };

      return (
        <div>
          <h1>${model} Management</h1>
          {/* Add UI elements for CRUD operations here */}
        </div>
      );
    }
    `

		const outputPath = path.resolve(__dirname, `../output/${model}Crud.tsx`)
		fs.outputFileSync(outputPath, crudTemplate)

		console.log(`CRUD page for ${model} generated at ${outputPath}`)
	})

export default generateCrud
