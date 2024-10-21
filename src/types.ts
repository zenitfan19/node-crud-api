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

export { HttpMethod };
export type { UserInput };
