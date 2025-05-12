import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { config as dotenvConfig } from "dotenv";
import http from "node:http";
import { UsersModel } from "./models/UsersModel";
import { DbSyncMessage, MessageType, WorkerMessage } from "./types";

dotenvConfig();

const PORT = Number(process.env.PORT) || 4000;
const numCPUs = availableParallelism() - 1;

let currentWorker = 0;

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);
  console.log(`Starting ${numCPUs} workers...`);

  const usersModel = UsersModel.getInstance();
  const workers: { id: number; port: number }[] = [];

  for (let i = 0; i < numCPUs; i++) {
    const port = PORT + i + 1;
    const worker = cluster.fork({ WORKER_PORT: port });
    workers.push({ id: worker.id || 0, port });

    worker.on("message", (message: WorkerMessage) => {
      if (message.type === MessageType.DB_UPDATE) {
        usersModel.setUsers(message.data);

        // Broadcast to all other workers
        for (const clusterWorker of Object.values(cluster.workers || {})) {
          if (clusterWorker?.id !== worker.id) {
            const syncMessage: DbSyncMessage = {
              type: MessageType.DB_SYNC,
              data: message.data,
            };
            clusterWorker?.send(syncMessage);
          }
        }
      } else if (message.type === MessageType.DB_REQUEST_SYNC) {
        // Send current data to the requesting worker
        const syncMessage: DbSyncMessage = {
          type: MessageType.DB_SYNC,
          data: usersModel.getUsers(),
        };
        worker.send(syncMessage);
      }
    });
  }

  const loadBalancer = createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      const worker = workers[currentWorker];

      // Move to next worker (round-robin)
      currentWorker = (currentWorker + 1) % numCPUs;

      // Forward the request to the selected worker
      const options = {
        hostname: "localhost",
        port: worker.port,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };

      const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res);
      });

      req.pipe(proxyReq);
    }
  );

  loadBalancer.listen(PORT, () => {
    console.log(`Load balancer running on port ${PORT}`);
  });
} else {
  import("./app.js");
}
