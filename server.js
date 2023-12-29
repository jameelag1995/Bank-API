import "dotenv/config";
import express from "express";
import cors from "cors";
import bankRoutes from "./routes/routes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// cors middleware
app.use(cors());

// json parsing middleware
app.use(express.json());

// routes middleware
app.use("/api/v1/bank", bankRoutes);

// error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
