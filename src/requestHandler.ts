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
        getUser(userId, response);
      }

      if (method === HttpMethod.PUT) {
        updateUser(userId, request, response);
      }

      if (method === HttpMethod.DELETE) {
        deleteUser(userId, response);
      }
    }

    if (pathname === "/api/users") {
      if (method === HttpMethod.GET) {
        getUsers(response);
      }

      if (method === HttpMethod.POST) {
        createUser(request, response);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
