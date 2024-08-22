export const crudTemplate = (model: string) => {
	const modelLowerCase = model.toLowerCase()
	return `
    import { useState, useEffect } from 'react';
    import axios from 'axios';

    export default function ${model}Crud() {
      const [data, setData] = useState([]);
      const [newItem, setNewItem] = useState({}); // Initial state for form inputs

      // Fetch data from API
      useEffect(() => {
        fetchData();
      }, []);

      const fetchData = async () => {
        const response = await axios.get('/api/${modelLowerCase}');
        setData(response.data);
      };

      // Handle Create
      const handleCreate = async () => {
        await axios.post('/api/${modelLowerCase}', newItem);
        fetchData();
        setNewItem({}); // Reset form after submission
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
          <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
            {/* Add form fields dynamically */}
            <input
              type="text"
              placeholder="Enter ${model} details"
              value={newItem.name || ''}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <button type="submit">Create ${model}</button>
          </form>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                    <button onClick={() => handleUpdate(item.id, { name: 'Updated Name' })}>Update</button>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  `
}
