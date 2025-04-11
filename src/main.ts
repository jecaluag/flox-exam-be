import express from "express";
import cors from "cors";
import { setupDatabase } from "./db/database";
import { taskRoutes } from "./routes/taskRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

setupDatabase();

app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
