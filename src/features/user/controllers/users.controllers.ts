import pool from "../../../config/database/PGconfig";
import bcrypt from 'bcrypt';
import createUserTable from "../models/users";
import { Request, Response } from 'express';

createUserTable();

export const createUser = async (req: Request, res: Response) => {
  const { cc, firstName, lastName, email, password } = req.body;

  try {
    // Validación de campos requeridos
    if (!cc || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Falta un campo requerido" });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario en la base de datos
    const query = `
      INSERT INTO users (cc, first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING cc, email;
    `;
    const values = [cc, firstName, lastName, email, hashedPassword];

    const result = await pool.query(query, values);
    const saveUser = result.rows[0];

    return res.json({
      id: saveUser.id,
      cc: saveUser.cc,
      email: saveUser.email,
      message: "USUARIO CREADO CORRECTAMENTE",
    });

  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error) {
      const pgError = error as { code: string; message: string };
      if (pgError.code === '23505') {
        return res.status(409).json({ message: "El correo electrónico o la cédula ya están registrados" });
      } else {
        return res.status(500).json({ message: "Error al crear el usuario", details: pgError.message });
      }
    } else {
      return res.status(500).json({ message: "Error al crear el usuario", details: "Unknown error" });
    }
  }
};

export const getUser = async (_req: Request, res: Response) => {
    try {
      const query = `
        SELECT *
        FROM users;
      `;
  
      const result = await pool.query(query);
      res.json(result.rows);
  
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Error al obtener los usuarios", details: error.message });
      } else {
        res.status(500).json({ message: "Error al obtener los usuarios", details: "Unknown error" });
      }
    }
  };

  export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { cc } = req.params;
  
    try {
      const query = `
        DELETE FROM users
        WHERE cc = $1
        RETURNING cc;
      `;
  
      const result = await pool.query(query, [cc]);
  
      if (result.rowCount === 0) {
         res.status(404).json({ message: "Usuario no encontrado" });
         return;
      }
  
      res.json({ message: "Usuario eliminado correctamente", deletedCC: result.rows[0].cc });
  
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Error al eliminar el usuario", details: error.message });
      } else {
        res.status(500).json({ message: "Error al eliminar el usuario", details: "Unknown error" });
      }
    }
  };