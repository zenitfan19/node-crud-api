import { IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url";
import cluster from "node:cluster";
import { HttpMethod } from "./types";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "./userService";
import { sendErrorResponse } from "./helpers/sendErrorResponse";
import { getServerPort } from "./helpers/getServerPort";

export const requestHandler = (
  request: IncomingMessage,
  response: ServerResponse
) => {
  try {
    const { url = "", method, headers } = request;
    const parsedUrl = new URL(url, `http://${headers.host}`);
    const { pathname } = parsedUrl;

    const workerId = cluster.isWorker
      ? `Worker ${cluster.worker?.id}`
      : "Primary";

    const port = getServerPort();

    console.log(
      `[${workerId}] Request received on port: ${port}, path: ${pathname}, method: ${method}`
    );

    response.setHeader("X-Handled-By-Worker", workerId);
    response.setHeader("X-Handled-On-Port", port);

    const userIdMatch = pathname.match(/^\/api\/users\/([0-9a-fA-F-]+)$/);
    const userId = userIdMatch ? userIdMatch[1] : null;

    if (userId) {
      if (method === HttpMethod.GET) {
        return getUser(userId, response);
      }

      if (method === HttpMethod.PUT) {
        return updateUser(userId, request, response);
      }

      if (method === HttpMethod.DELETE) {
        return deleteUser(userId, response);
      }
    }

    if (pathname === "/api/users") {
      if (method === HttpMethod.GET) {
        return getUsers(response);
      }

      if (method === HttpMethod.POST) {
        return createUser(request, response);
      }
    }

    sendErrorResponse(404, "Invalid endpoint", response);
  } catch (error) {
    console.error(error);
    sendErrorResponse(500, "Internal server error", response);
  }
};
