import pool from "../../../config/database/PGconfig";

const createUserTable = async() => {
    const createtableQuery =
        `
    CREATE TABLE IF NOT EXISTS users (
      cc VARCHAR(20) PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,          
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
    try {
        pool.query(createtableQuery)
        console.log("User table created successfully")
    }catch{
        console.log("Error creating user table")
    }
};

export default createUserTable;