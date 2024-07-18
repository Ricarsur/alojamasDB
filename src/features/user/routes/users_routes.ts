import { Router } from "express";
import { createUser, getUser, deleteUser } from "../controllers/users.controllers";

const router = Router();

router.post('/users', createUser);
router.get('/users', getUser);
router.delete('/users/:cc', deleteUser);

export default router;