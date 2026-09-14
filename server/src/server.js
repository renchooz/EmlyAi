import "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import { startKeepAlivePing } from "./utils/keepAlive.js";

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startKeepAlivePing();
});
