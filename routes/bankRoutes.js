import express from "express";
import {
    activate,
    createUser,
    deactivate,
    deposit,
    filterActiveUsersByBalance,
    filterActiveUsersByCash,
    filterActiveUsersByCredit,
    getAllUsers,
    getUserById,
    transfer,
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

// withdraw money from user
router.put("/withdraw/:userId", withdraw);

// transfer money between users
router.put("/transfer", transfer);

// activate user by id
router.put("/activate/:userId", activate);

// deactivate user by id
router.put("/deactivate/:userId", deactivate);

// filter active users by balance
router.get("/filteractivebybalance/:balance", filterActiveUsersByBalance);

// filter active users by cash
router.get("/filteractivebycash/:cash", filterActiveUsersByCash);

// filter active users by credit
router.get("/filteractivebycredit/:credit", filterActiveUsersByCredit);

export default router;
