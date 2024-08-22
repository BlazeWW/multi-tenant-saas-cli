export const dbName = (entityName: string) => `
// Database interaction to get a single name
const data = await fetchDataFromDB(event.pathParameters.id);
			
// Function to interact with PostgreSQL database for a single item
const fetchDataFromDB = async (id) => {
  try {
    const repository = getRepository(${entityName});
    const data = await repository.findOne(id);

    if (!data) {
      throw new Error('${entityName} not found');
    }

    return data;
  } catch (error) {
    console.error('Database fetch error:', error.message);
    throw new Error('Database fetch failed');
  }
};
`
