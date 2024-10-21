import { IncomingMessage, ServerResponse } from "node:http";
import { validate } from "uuid";
import { UsersModel } from "./models/UsersModel";
import { UserInput } from "./types";
import { sendErrorResonse } from "./helpers/sendErrorResponse";

const usersModel = new UsersModel();

const getUsers = (response: ServerResponse) => {
  try {
    const users = usersModel.getUsers();

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(users));
  } catch (error) {
    console.error(error);
    sendErrorResonse(500, "Internal server error", response);
  }
};

const getUser = (userId: string, response: ServerResponse) => {
  try {
    const isUserIdInvalid = !validate(userId);
    if (isUserIdInvalid) {
      sendErrorResonse(400, "Invalid user id", response);
      return;
    }

    const user = usersModel.getUser(userId);

    if (user) {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(user));
    } else {
      sendErrorResonse(404, "User not found", response);
    }
  } catch (error) {
    console.error(error);
    sendErrorResonse(500, "Internal server error", response);
  }
};

const createUser = (request: IncomingMessage, response: ServerResponse) => {
  let requestBody = "";

  request.on("data", (chunk) => {
    requestBody += chunk;
  });

  request.on("end", () => {
    try {
      const { username, age, hobbies } =
        (JSON.parse(requestBody) as UserInput) ?? {};
      const isUserDataInvalid =
        !username || typeof age !== "number" || !Array.isArray(hobbies);

      if (isUserDataInvalid) {
        sendErrorResonse(400, "Invalid user data", response);
        return;
      }

      const newUser = usersModel.addUser({ username, age, hobbies });

      response.writeHead(201, { "Content-Type": "application/json" });
      response.end(JSON.stringify(newUser));
    } catch (error) {
      console.error(error);
      sendErrorResonse(500, "Internal server error", response);
    }
  });
};

const updateUser = (
  userId: string,
  request: IncomingMessage,
  response: ServerResponse
) => {
  const isUserIdInvalid = !validate(userId);
  if (isUserIdInvalid) {
    sendErrorResonse(400, "Invalid user id", response);
    return;
  }

  const user = usersModel.getUser(userId);
  if (!user) {
    sendErrorResonse(404, "User not found", response);
    return;
  }

  let requestBody = "";

  request.on("data", (chunk) => {
    requestBody += chunk;
  });

  request.on("end", () => {
    try {
      const { username, age, hobbies } =
        (JSON.parse(requestBody) as UserInput) ?? {};
      const isUserDataInvalid =
        !username || typeof age !== "number" || !Array.isArray(hobbies);

      if (isUserDataInvalid) {
        sendErrorResonse(400, "Invalid user data", response);
        return;
      }

      const updatedUser = user.updateUser({ username, age, hobbies });

      response.writeHead(201, { "Content-Type": "application/json" });
      response.end(JSON.stringify(updatedUser));
    } catch (error) {
      console.error(error);
      sendErrorResonse(500, "Internal server error", response);
    }
  });
};

const deleteUser = (userId: string, response: ServerResponse) => {
  const isUserIdInvalid = !validate(userId);
  if (isUserIdInvalid) {
    sendErrorResonse(400, "Invalid user id", response);
    return;
  }

  const user = usersModel.getUser(userId);
  if (!user) {
    sendErrorResonse(404, "User not found", response);
    return;
  }

  usersModel.deleteUser(userId);

  response.writeHead(204);
  response.end();
};

export { getUsers, getUser, createUser, updateUser, deleteUser };
