import { Router } from "express";
import { createUser } from "../controllers/users.controllers";

const router = Router();

router.post('/users', createUser);

export default router;