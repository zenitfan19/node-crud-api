import { config as dotenvConfig } from "dotenv";
import { createServer } from "node:http";
import { requestHandler } from "./requestHandler";

dotenvConfig();

const PORT = process.env.PORT || 4000;

const server = createServer(requestHandler);
server.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
