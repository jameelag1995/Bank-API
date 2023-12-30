import express from "express";
import { getInfo } from "../controllers/bankControllers.js";

const router = express.Router();

// display all users
router.get("/", getInfo);

export default router;
