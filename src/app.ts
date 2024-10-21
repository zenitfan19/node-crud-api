import { config as dotenvConfig } from "dotenv";
import { createServer } from "http";

dotenvConfig();

const PORT = process.env.PORT || 4000;

const server = createServer();
server.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
