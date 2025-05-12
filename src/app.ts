import { config as dotenvConfig } from "dotenv";
import { createServer } from "node:http";
import { requestHandler } from "./requestHandler";
import cluster from "node:cluster";
import { getServerPort } from "./helpers/getServerPort";

dotenvConfig();

const PORT = getServerPort();

const server = createServer(requestHandler);
server.listen(PORT, () => {
  if (cluster.isWorker) {
    console.log(`Worker ${cluster.worker?.id} is listening on PORT: ${PORT}`);
  } else {
    console.log(`Server is running on PORT: ${PORT}`);
  }
});
