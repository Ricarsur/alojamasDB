import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new pg.Pool({
    user: process.env.USERPG,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: 5432,
    database: process.env.DB
})

export default pool;

