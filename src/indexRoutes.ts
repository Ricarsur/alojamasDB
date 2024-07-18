import express from "express";
import user_router from "./features/user/routes/users_routes";

const router = express.Router();

router.use(user_router);

export default router;
