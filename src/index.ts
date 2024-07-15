import dotenv from 'dotenv'
import app from "./app"
import pool from './config/database/PGconfig';

dotenv.config()


async function main() {
    try {
      // Verificar la conexión a PostgreSQL
      await pool.query('SELECT NOW()');
      console.log('Connected to PostgreSQL database');
  
      const PORT = process.env.PORT ?? 5174;
  
      app.listen(PORT, () => {
        console.log(`The server is running on http://localhost:${PORT}`);
        
      });
    } catch (error) {
      console.error('OMG, I could not connect to the DB:', error);
    }
  }

  main();

