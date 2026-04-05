import app from "./app";
import { connectDB } from "./infrastructure/database/connectDB";
import { ENV } from "./config/env";

const startServer = async () => {
  await connectDB();

  app.listen(ENV.PORT, () => {
    console.log(`Server is running at port: ${ENV.PORT}`);
  });
};

startServer();
