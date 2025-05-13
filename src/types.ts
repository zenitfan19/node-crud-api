import { User } from "./models/User";

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
}

type UserInput = {
  username: string;
  age: number;
  hobbies: string[];
};

enum MessageType {
  DB_SYNC = "DB_SYNC",
  DB_UPDATE = "DB_UPDATE",
  DB_REQUEST_SYNC = "DB_REQUEST_SYNC",
}

interface BaseMessage {
  type: MessageType;
}

interface DbSyncMessage extends BaseMessage {
  type: MessageType.DB_SYNC;
  data: User[];
}

interface DbUpdateMessage extends BaseMessage {
  type: MessageType.DB_UPDATE;
  data: User[];
}

interface DbRequestSyncMessage extends BaseMessage {
  type: MessageType.DB_REQUEST_SYNC;
}

// Union type for all possible messages
type WorkerMessage = DbSyncMessage | DbUpdateMessage | DbRequestSyncMessage;

export { HttpMethod, MessageType };
export type {
  UserInput,
  WorkerMessage,
  DbRequestSyncMessage,
  DbUpdateMessage,
  DbSyncMessage,
};
