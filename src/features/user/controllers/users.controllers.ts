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
