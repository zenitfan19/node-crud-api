import { ServerResponse } from "node:http";

const sendErrorResponse = (
  status: number,
  message: string,
  response: ServerResponse
) => {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ message }));
};

export { sendErrorResponse };
