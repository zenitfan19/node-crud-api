import { IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url";
import { HttpMethod } from "./types";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "./userService";
import { sendErrorResonse } from "./helpers/sendErrorResponse";

export const requestHandler = async (
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> => {
  try {
    const { url = "", method, headers } = request;
    const parsedUrl = new URL(url, `http://${headers.host}`);
    const { pathname } = parsedUrl;

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

    sendErrorResonse(404, "Invalid endpoint", response);
  } catch (error) {
    console.error(error);
    sendErrorResonse(500, "Internal server error", response);
  }
};
