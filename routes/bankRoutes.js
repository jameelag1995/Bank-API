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
router.put("/update-credit/:userId", updateCredit);

// withdraw money from user
router.put("/withdraw/:userId", withdraw);

// transfer money between users
router.put("/transfer", transfer);

// activate user by id
router.put("/activate/:userId", activate);

// deactivate user by id
router.put("/deactivate/:userId", deactivate);

// filter active users by balance
router.get("/filter-active-by-balance/:balance", filterActiveUsersByBalance);

// filter active users by cash
router.get("/filter-active-by-cash/:cash", filterActiveUsersByCash);

// filter active users by credit
router.get("/filter-active-by-credit/:credit", filterActiveUsersByCredit);

export default router;
