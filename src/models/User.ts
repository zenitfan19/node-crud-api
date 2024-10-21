import { v4 as uuidv4 } from "uuid";
import { UserInput } from "../types";

class User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];

  constructor(userData: UserInput) {
    this.id = uuidv4();
    this.username = userData.username;
    this.age = userData.age;
    this.hobbies = userData.hobbies;
  }

  updateUser({ username, age, hobbies }: UserInput) {
    if (username) {
      this.username = username;
    }
    if (age) {
      this.age = age;
    }
    if (hobbies) {
      this.hobbies = hobbies;
    }

    return this;
  }
}

export { User };
