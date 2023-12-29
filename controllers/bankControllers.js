import BANK_CONSTANTS from "../constants/bankConstants.js";
import STATUS_CODE from "../constants/statusCodes.js";
import { readUsersFromFile, writeUsersToFile } from "../models/bankModels.js";
import { v4 as uuidv4 } from "uuid";

// @des get all users
// @route GET /api/v1/bank
export const getAllUsers = async (req, res, next) => {
    try {
        const users = readUsersFromFile();
        res.send(users);
    } catch (error) {
        next(error);
    }
};

// @des   create new user
// @route POST /api/v1/bank
export const createUser = async (req, res, next) => {
    try {
        let { fullName, cash, credit } = req.body;
        if (!fullName) {
            res.status(STATUS_CODE.BAD_REQUEST);
            throw new Error("full name is required");
        }
        if (!cash || !credit) {
            cash = 0;
            credit = 0;
        }
        const users = readUsersFromFile();
        if (users.some((user) => user.fullName === fullName)) {
            res.status(STATUS_CODE.CONFLICT);
            throw new Error("A user with the same name already exists");
        }
        const newUser = {
            id: uuidv4(),
            fullName,
            cash,
            credit,
        };
        users.push(newUser);
        writeUsersToFile(users);
        res.status(STATUS_CODE.CREATED).send(newUser);
    } catch (error) {
        next(error);
    }
};

// @des   get user by id
// @route GET /api/v1/bank/:userId
export const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const users = readUsersFromFile();
        const searchedUser = users.find((user) => user.id === userId);
        if (!searchedUser) {
            res.status(STATUS_CODE.NOT_FOUND);
            throw new Error("No user found with this id");
        }
        res.send(searchedUser);
    } catch (error) {
        next(error);
    }
};

// @des   Deposit cash to user by id
// @route PUT /api/v1/bank/deposit/:userId
export const deposit = (req, res, next) => {
    try {
        const userId = req.params.userId;
        const users = readUsersFromFile();
        const searchedUser = users.find((user) => user.id === userId);
        if (!searchedUser) {
            res.status(STATUS_CODE.NOT_FOUND);
            throw new Error("No user found with this id");
        }
        const { amount } = req.body;
        if (amount <= BANK_CONSTANTS.MINIMUM_AMOUNT) {
            res.status(STATUS_CODE.BAD_REQUEST);
            throw new Error("Amount of deposit must be positive");
        }

        searchedUser.cash += amount;
        writeUsersToFile(users);
        res.send(searchedUser);
    } catch (error) {
        next(error);
    }
};

// @des   Update user credit by id
// @route PUT /api/v1/bank/updatecredit/:userId
export const updateCredit = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const users = readUsersFromFile();
        const searchedUser = users.find((user) => user.id === userId);
        if (!searchedUser) {
            res.status(STATUS_CODE.NOT_FOUND);
            throw new Error("No user found with this id");
        }
        const { amount } = req.body;
        if (amount <= BANK_CONSTANTS.MINIMUM_AMOUNT) {
            res.status(STATUS_CODE.BAD_REQUEST);
            throw new Error("Amount of credit to update must be positive");
        }

        searchedUser.credit += amount;
        writeUsersToFile(users);
        res.send(searchedUser);
    } catch (error) {
        next(error);
    }
};

// @des   Withdraw money from user by id
// @route PUT /api/v1/bank/withdraw/:userId
export const withdraw = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const users = readUsersFromFile();
        const searchedUser = users.find((user) => user.id === userId);
        if (!searchedUser) {
            res.status(STATUS_CODE.NOT_FOUND);
            throw new Error("No user found with this id");
        }
        let { amount } = req.body;
        if (amount <= BANK_CONSTANTS.MINIMUM_AMOUNT) {
            res.status(STATUS_CODE.BAD_REQUEST);
            throw new Error("Amount of money to withdraw must be positive");
        }
        if (amount <= searchedUser.credit + searchedUser.cash) {
            if (amount <= searchedUser.cash) {
                searchedUser.cash -= amount;
            } else if (amount <= searchedUser.credit) {
                searchedUser.credit -= amount;
            } else {
                amount -= searchedUser.cash;
                searchedUser.cash = 0;
                searchedUser.credit -= amount;
            }
        } else {
            res.status(STATUS_CODE.CONFLICT);
            throw new Error("You don't have enough credit or cash to withdraw");
        }
        writeUsersToFile(users);
        res.send(searchedUser);
    } catch (error) {
        next(error);
    }
};
