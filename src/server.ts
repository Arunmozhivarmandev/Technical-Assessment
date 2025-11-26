import app from "./app";
import { connectDB } from "./config/db";
import { adminBootstrap } from "./scripts/admin.bootstrap";

const PORT = process.env.PORT || 4000;

// Connect DB
connectDB();
adminBootstrap();

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
