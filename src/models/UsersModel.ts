import { UserInput } from "../types";
import { User } from "./User";

class UsersModel {
  private users: User[];

  constructor() {
    this.users = [];
  }

  getUsers() {
    return this.users;
  }

  getUser(userId: string) {
    return this.users.find(({ id }) => id === userId);
  }

  addUser(userData: UserInput) {
    const user = new User(userData);
    this.users.push(user);
  }

  deleteUser(userId: string) {
    const userIndex = this.users.findIndex(({ id }) => id === userId);

    if (userIndex >= 0) {
      this.users.splice(userIndex, 1);
    }
  }
}

export { UsersModel };
