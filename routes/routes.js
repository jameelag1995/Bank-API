import express from "express";
import {
    createUser,
    deposit,
    getAllUsers,
    getUserById,
    updateCredit,
    withdraw,
} from "../controllers/bankControllers.js";

const router = express.Router();

// display all users
router.get("/", getAllUsers);

// create new user
router.post("/", createUser);

// returns user info by id
router.get("/:userId", getUserById);

// update user cash
router.put("/deposit/:userId", deposit);

// update user credit
router.put("/updatecredit/:userId", updateCredit);

// update user credit
router.put("/withdraw/:userId", withdraw);

export default router;
