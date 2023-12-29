import fs from "fs";
import { filePath } from "../utils/filePath.js";

const initializeDataFile = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), "utf-8");
    }
};

const readUsersFromFile = () => {
    try {
        initializeDataFile();
        const fileData = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(fileData);
    } catch (error) {
        throw new Error("Error reading from users file");
    }
};

const writeUsersToFile = (users) => {
    try {
        initializeDataFile();
        fs.writeFileSync(filePath, JSON.stringify(users), "utf-8");
    } catch (error) {
        throw new Error("Error writing to the users file");
    }
};

export { readUsersFromFile, writeUsersToFile };
