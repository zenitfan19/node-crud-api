import cluster from "node:cluster";
import {
  DbRequestSyncMessage,
  DbUpdateMessage,
  MessageType,
  UserInput,
  WorkerMessage,
} from "../types";
import { User } from "./User";

class UsersModel {
  private static instance: UsersModel;
  private users: User[];

  private constructor() {
    this.users = [];

    if (!cluster.isPrimary && process.send) {
      process.on("message", (message: WorkerMessage) => {
        if (message.type === MessageType.DB_SYNC) {
          this.users = message.data.map(User.fromPlainObject);
        }
      });

      const requestMessage: DbRequestSyncMessage = {
        type: MessageType.DB_REQUEST_SYNC,
      };
      process.send(requestMessage);
    }
  }

  public static getInstance(): UsersModel {
    if (!UsersModel.instance) {
      UsersModel.instance = new UsersModel();
    }
    return UsersModel.instance;
  }

  getUsers() {
    return this.users;
  }

  setUsers(users: User[]) {
    this.users = users;
  }

  getUser(userId: string) {
    return this.users.find(({ id }) => id === userId);
  }

  addUser(userData: UserInput) {
    const user = new User(userData);
    this.users.push(user);

    this.syncChanges();
    return user;
  }

  deleteUser(userId: string) {
    const userIndex = this.users.findIndex(({ id }) => id === userId);

    if (userIndex >= 0) {
      this.users.splice(userIndex, 1);
      this.syncChanges();
    }
  }

  updateUser(userId: string, userData: UserInput) {
    const user = this.getUser(userId);
    if (user) {
      user.updateUser(userData);
      this.syncChanges();
      return user;
    }
    return null;
  }

  private syncChanges(): void {
    if (!cluster.isPrimary && process.send) {
      const updateMessage: DbUpdateMessage = {
        type: MessageType.DB_UPDATE,
        data: this.users,
      };
      process.send(updateMessage);
    }
  }
}

export { UsersModel };
