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
        let chosenId = uuidv4();
        let idIsUnique = false;
        while (!idIsUnique) {
            let index = users.findIndex((user) => user.id === chosenId);
            if (index === BANK_CONSTANTS.USER_NOT_FOUND) {
                idIsUnique = true;
            } else {
                chosenId = uuidv4();
            }
        }
        const newUser = {
            id: chosenId,
            fullName,
            cash,
            credit,
            isActive: true,
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

// @des   transfer money from user by id to another user by id
// @route PUT /api/v1/bank/transfer
export const transfer = async (req, res, next) => {
    try {
        let { fromId, toId, amount } = req.body;
        const users = readUsersFromFile();
        const userToTransferFrom = users.find((user) => user.id === fromId);
        if (!userToTransferFrom) {
            res.status(STATUS_CODE.BAD_REQUEST);
            throw new Error(
                "User you are trying to transfer money from doesn't exist."
            );
        }
        const userToTransferTo = users.find((user) => user.id === toId);
        if (!userToTransferTo) {
            res.status(STATUS_CODE.BAD_REQUEST);
            throw new Error(
                "User you are trying to transfer money To doesn't exist."
            );
        }
        if (amount <= userToTransferFrom.cash + userToTransferFrom.credit) {
            const originalAmountToTransfer = amount;
            if (amount <= userToTransferFrom.cash) {
                userToTransferFrom.cash -= amount;
            } else {
                amount -= userToTransferFrom.cash;
                userToTransferFrom.cash = 0;
                userToTransferFrom.credit -= amount;
            }
            userToTransferTo.credit += originalAmountToTransfer;
        } else {
            res.status(STATUS_CODE.CONFLICT);
            throw new Error(
                "User trying to transfer doesn't have enough credit or cash to transfer."
            );
        }
        writeUsersToFile(users);
        res.send({ userToTransferFrom, userToTransferTo });
    } catch (error) {
        next(error);
    }
};

// @des   Deactivate user by id
// @route PUT /api/v1/bank/deactivate/:userId
export const deactivate = (req, res, next) => {
    try {
        const users = readUsersFromFile();
        const userId = req.params.userId;
        const userToDeactivate = users.find((user) => user.id === userId);
        if (!userToDeactivate) {
            res.status(STATUS_CODE.BAD_REQUEST);
            throw new Error("No user found with this id");
        }
        userToDeactivate.isActive = false;
        writeUsersToFile(users);
        res.send(userToDeactivate);
    } catch (error) {
        next(error);
    }
};

// @des   Activate user by id
// @route PUT /api/v1/bank/activate/:userId
export const activate = (req, res, next) => {
    try {
        const users = readUsersFromFile();
        const userId = req.params.userId;
        const userToActivate = users.find((user) => user.id === userId);
        if (!userToActivate) {
            res.status(STATUS_CODE.BAD_REQUEST);
            throw new Error("No user found with this id");
        }
        userToActivate.isActive = true;
        writeUsersToFile(users);
        res.send(userToActivate);
    } catch (error) {
        next(error);
    }
};

// @des   filter active users by balance
// @route GET /api/v1/bank/filteractivebybalance/:balance
export const filterActiveUsersByBalance = (req, res, next) => {
    try {
        const users = readUsersFromFile();
        const balance = parseInt(req.params.balance);
        if (!balance) {
            res.status(STATUS_CODE.BAD_REQUEST);
            throw new Error("balance must be a number!");
        }
        const filteredUsers = users.filter(
            (user) => user.credit + user.cash >= balance && user.isActive
        );
        if (!filteredUsers) {
            res.status(STATUS_CODE.NOT_FOUND);
            throw new Error("No such users");
        }
        res.send(filteredUsers);
    } catch (error) {
        next(error);
    }
};

// @des   filter active users by cash
// @route GET /api/v1/bank/filteractivebycash/:cash
export const filterActiveUsersByCash = (req, res, next) => {
    try {
        const users = readUsersFromFile();
        const cash = parseInt(req.params.cash);
        if (!cash) {
            res.status(STATUS_CODE.BAD_REQUEST);
            throw new Error("cash must be a number!");
        }
        const filteredUsers = users.filter(
            (user) => user.cash >= cash && user.isActive
        );
        if (!filteredUsers) {
            res.status(STATUS_CODE.NOT_FOUND);
            throw new Error("No such users");
        }
        res.send(filteredUsers);
    } catch (error) {
        next(error);
    }
};

// @des   filter active users by credit
// @route GET /api/v1/bank/filteractivebycredit/:credit
export const filterActiveUsersByCredit = (req, res, next) => {
    try {
        const users = readUsersFromFile();
        const credit = parseInt(req.params.credit);
        if (!credit) {
            res.status(STATUS_CODE.BAD_REQUEST);
            throw new Error("credit must be a number!");
        }
        const filteredUsers = users.filter(
            (user) => user.credit >= credit && user.isActive
        );
        if (!filteredUsers) {
            res.status(STATUS_CODE.NOT_FOUND);
            throw new Error("No such users");
        }
        res.send(filteredUsers);
    } catch (error) {
        next(error);
    }
};

export const getInfo = (req, res, next) => {
    res.send({
        getAllUsers: "GET /api/v1/bank - Shows All Users Info",
        createUser: "POST /api/v1/bank - Creates New User",
        getUserById: "GET /api/v1/bank/:userId - Shows User Info",
        deposit:
            "PUT /api/v1/bank/deposit/:userId - Deposit Money To User's Cash",
        updateCredit:
            "PUT /api/v1/bank/updatecredit/:userId - Update User's Credit",
        withdraw:
            "PUT /api/v1/bank/withdraw/:userId - Withdraw Money From User's Account",
        transfer:
            "PUT /api/v1/bank/transfer - Transfer Money Between Bank Accounts",
        filterActiveUsersByBalance:
            "GET /api/v1/bank/filteractivebybalance/:balance - Shows Active Users with Given Balance",
        filterActiveUsersByCash:
            "GET /api/v1/bank/filteractivebycash/:cash - Shows Active Users with Given Cash",
        filterActiveUsersByCredit:
            "GET /api/v1/bank/filteractivebycredit/:credit - Shows Active Users with Given Credit",
    });
};
