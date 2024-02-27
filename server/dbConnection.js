import sql from 'mssql';

const dbConfig = {
  user: 'k4m2a',
  password: 'D7gefr98F&1lbIjec',
  server: '120.138.8.94',
  database: 'k4m2a',
  port: 14433,
  options: {
    encrypt: false,
  },
};

const connectToDatabase = async () => {
  try {
    await sql.connect(dbConfig);
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

const disconnectFromDatabase = () => {
  sql.close();
  console.log('Disconnected from the database');
};

const executeQuery = async (query) => {
  try {
    const result = await sql.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

export {
  connectToDatabase,
  disconnectFromDatabase,
  executeQuery,
};
