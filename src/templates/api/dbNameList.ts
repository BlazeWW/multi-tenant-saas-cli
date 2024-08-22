export const dbNameList = (entityName: string) => `
// Database interaction to get list of names
const data = await fetchDataListFromDB();
			
// Function to interact with PostgreSQL database for a list of items
const fetchDataListFromDB = async () => {
  try {
    const repository = getRepository(${entityName});
    const dataList = await repository.find();
    return dataList;
  } catch (error) {
    console.error('Database fetch error:', error.message);
    throw new Error('Database fetch failed');
  }
};
`
